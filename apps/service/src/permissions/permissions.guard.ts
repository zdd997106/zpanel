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
import {
  EPermission,
  EPermissionAction,
  EPermissionStatus,
  ERole,
} from '@zpanel/core';

import { AuthGuard } from 'src/auth';
import { DatabaseService } from 'src/database';

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
  static CanCreate(...permissions: EPermission[]) {
    return createGuardDecorator({
      required: permissions,
      action: EPermissionAction.CREATE,
    });
  }

  /**
   * Creates a guard for 'read' action.
   * @description This guard will run the authentication guard by default.
   */
  static CanRead(...permissions: EPermission[]) {
    return createGuardDecorator({
      required: permissions,
      action: EPermissionAction.READ,
    });
  }

  /**
   * Creates a guard for 'update' action.
   * @description This guard will run the authentication guard by default.
   */
  static CanUpdate(...permissions: EPermission[]) {
    return createGuardDecorator({
      required: permissions,
      action: EPermissionAction.UPDATE,
    });
  }

  /**
   * Creates a guard for 'delete' action.
   * @description This guard will run the authentication guard by default.
   */
  static CanDelete(...permissions: EPermission[]) {
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

      required: !Array.isArray(configInput.required)
        ? [configInput.required]
        : configInput.required,
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

    // Find all permissions for the current signed-in user's role.
    const permissions = await this.dbs.permission.findMany({
      select: { roles: { select: { action: true } } },
      where: {
        deleted: false,
        status: EPermissionStatus.ENABLED,
        roles: {
          some: {
            role: { rid: role.rid },
            permission: { code: { in: config.required.map(String) } },
          },
        },
      },
    });

    // Check if user has required permissions for the action.
    if (
      permissions.length <= 0 ||
      !permissions.every(
        (permission) =>
          (permission.roles[0].action & actionValue) === actionValue,
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
  required: EPermission | EPermission[];
  action?: EPermissionAction | EPermissionAction[];
}

interface PermissionGuardConfig {
  required: EPermission[];
  action?: EPermissionAction[];
}
