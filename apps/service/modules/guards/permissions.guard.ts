import { Request } from 'express';
import { sum } from 'lodash';
import {
  Injectable,
  CanActivate,
  UnauthorizedException,
  Inject,
  ExecutionContext,
  ForbiddenException,
  UseGuards,
  applyDecorators,
} from '@nestjs/common';
import { REQUEST, Reflector } from '@nestjs/core';
import { EPermission, EPermissionAction, ERole } from '@zpanel/core';

import { DatabaseService } from 'modules/database';

import { AuthGuard } from './auth.guard';

// ----------

/**
 * Guard to protect routes based on user authentication and permissions.
 */
@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly dbs: DatabaseService,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  // --- DECORATORS ---

  /**
   * Creates a guard for 'create' action.
   * @description This guard will run the authentication guard by default.
   */
  static CanCreate(...permissions: (EPermission | EPermission[])[]) {
    return createGuardDecorator({
      required: permissions,
      action: EPermissionAction.CREATE,
    });
  }

  /**
   * Creates a guard for 'read' action.
   * @description This guard will run the authentication guard by default.
   */
  static CanRead(...permissions: (EPermission | EPermission[])[]) {
    return createGuardDecorator({
      required: permissions,
      action: EPermissionAction.READ,
    });
  }

  /**
   * Creates a guard for 'update' action.
   * @description This guard will run the authentication guard by default.
   */
  static CanUpdate(...permissions: (EPermission | EPermission[])[]) {
    return createGuardDecorator({
      required: permissions,
      action: EPermissionAction.UPDATE,
    });
  }

  /**
   * Creates a guard for 'delete' action.
   * @description This guard will run the authentication guard by default.
   */
  static CanDelete(...permissions: (EPermission | EPermission[])[]) {
    return createGuardDecorator({
      required: permissions,
      action: EPermissionAction.DELETE,
    });
  }

  // --- ROUTES ---

  /**
   * Determines whether the request is authorized based on permissions.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    await this.authenticate(this.getConfig(context));
    return true;
  }

  /**
   * Retrieves configuration for permission check.
   */
  private getConfig(context: ExecutionContext): PermissionGuardConfig {
    const configInput: PermissionGuardConfigInput =
      this.reflector.get(PermissionDecorator, context.getHandler()) || [];
    return {
      action:
        configInput.action && !Array.isArray(configInput.action)
          ? [configInput.action]
          : configInput.action,

      required: configInput.required.map((item) =>
        !Array.isArray(item) ? [item] : item,
      ),
    };
  }

  /**
   * Authenticates based on user's signed-in status and permissions.
   */
  private async authenticate(config: PermissionGuardConfig) {
    const actionValue = sum(config.action ?? [EPermissionAction.READ]);
    const role = await (this.request.signedInInfo?.roleId &&
      this.dbs.role.findUnique({
        where: { clientId: this.request.signedInInfo.roleId },
      }));

    // Check if user is signed-in.
    if (!role) {
      throw new UnauthorizedException();
    }

    // Skip permission check for admin roles
    if (role.code === ERole.ADMIN) return;

    // Find the required permissions that the user has
    const permissions = await this.dbs.permission.findMany({
      include: { roles: { where: { roleId: role.rid } } },
      where: { code: { in: config.required.flat() } },
    });

    // Create a map of permissions for easier lookup
    const permissionMap = Object.fromEntries(
      permissions.map((permission) => [permission.code, permission] as const),
    );

    this.request.matchedPermissions = permissions.map(
      (permission) => permission.code as EPermission,
    );

    // Check if user's permissions hit one of the set of required permissions.
    if (
      !config.required.some((requires) =>
        requires.every(
          (code) =>
            (permissionMap[code].roles[0]?.action & actionValue) ===
            actionValue,
        ),
      )
    ) {
      throw new ForbiddenException(`Unable to access this property`);
    }
  }
}

// ----- RELATED DECORATORS ---

// Decorator for permission configuration.
const PermissionDecorator =
  Reflector.createDecorator<PermissionGuardConfigInput>();

// Create guard decorator for applying both AuthGuard and PermissionGuard.
function createGuardDecorator(config: PermissionGuardConfigInput) {
  return applyDecorators(
    AuthGuard.Protect(),
    UseGuards(PermissionGuard),
    PermissionDecorator(config),
  );
}

// ----- RELATED INTERFACES ---

interface PermissionGuardConfigInput {
  required: (EPermission | EPermission[])[];
  action?: EPermissionAction | EPermissionAction[];
}

interface PermissionGuardConfig {
  required: EPermission[][];
  action?: EPermissionAction[];
}

declare module 'express' {
  interface Request {
    matchedPermissions?: EPermission[];
  }
}
