import { Request } from 'express';
import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { REQUEST } from '@nestjs/core';
import { createCache } from 'cache-manager';
import {
  EApplicationStatus,
  EPermissionStatus,
  ERole,
  SignInDto,
  SignUpDto,
} from '@zpanel/core';

import { createValidationError, encodePassword, Inspector } from 'utils';
import { Model, DatabaseService } from 'src/database';

import { TokenService } from './token.service';

// ----- SETTINGS -----

const ADMIN_ROLE_CACHE_KEY = 'adminRole';

const cache = createCache({
  ttl: 5 * 60 * 1000, // expires in 5 minutes
});

// ----------

@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly tokenService: TokenService,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  public signIn = async (signInDto: SignInDto) => {
    const { email } = signInDto;

    const user = await new Inspector(
      this.databaseService.user.findUnique({
        include: { role: { select: { clientId: true } } },
        where: { email },
      }),
    )
      .essential()
      .otherwise(
        () => new BadRequestException('Email or password is incorrect'),
      );

    await new Inspector(this.verifyPassword(user, signInDto.password))
      .expect(true)
      .otherwise(
        () => new BadRequestException('Email or password is incorrect'),
      );

    // Create refresh token and access token for the user after signing in
    const refreshToken = await this.tokenService.grantRefreshToken(user);
    await this.tokenService.grantAccessToken(user, refreshToken);
  };

  public signOut = async () => {
    await this.tokenService.expireTokens();
  };

  public createApplication = async (signUpDto: SignUpDto) => {
    // Check if the email has been registered
    await new Inspector(
      this.databaseService.user.findFirst({
        where: { email: signUpDto.email },
      }),
    )
      .expect(null)
      .otherwise(() =>
        createValidationError(['email'], 'Email has registered'),
      );

    const application = await this.databaseService.application.findUnique({
      where: { email: signUpDto.email },
    });

    if (application) {
      const reviewed = application.status !== EApplicationStatus.UNREVIEWED;
      await this.databaseService.application.update({
        where: { aid: application.aid },
        data: {
          ...signUpDto,
          status: reviewed
            ? EApplicationStatus.REAPPLIED
            : EApplicationStatus.UNREVIEWED,
          updatedAt: new Date(),
        },
      });
    } else {
      await this.databaseService.application.create({
        data: {
          ...signUpDto,
          status: EApplicationStatus.UNREVIEWED,
        },
      });
    }
  };

  /**
   * Finds the user currently signed in.
   */
  public async getSignedInUser() {
    return await new Inspector(
      this.databaseService.user.findFirst({
        where: { clientId: this.request.signedInInfo.userId },
        include: { role: true, avatar: true },
      }),
    )
      .essential()
      .otherwise(() => new UnauthorizedException());
  }

  /**
   * Encode password for unique-hash value
   */
  private async verifyPassword(user: Model.User, password: string) {
    return user.password === encodePassword(password, user.uid);
  }

  /**
   * Retrieves signed-in information.
   */
  private async getSignedInInfo() {
    const accessToken = await this.tokenService.findAccessToken();
    return await this.tokenService.verifyAccessToken(accessToken);
  }

  /**
   * Finds permissions of the currently signed-in user.
   */
  private async findSignedInUserPermissions() {
    const RoleWhereUniqueInput = { clientId: this.request.signedInInfo.roleId };

    return await this.databaseService.permission.findMany({
      where: {
        deleted: false,
        status: EPermissionStatus.ENABLED,
        roles: { some: { role: RoleWhereUniqueInput } },
      },
      include: {
        roles: {
          select: { action: true },
          where: { role: RoleWhereUniqueInput },
        },
      },
    });
  }

  /**
   * Finds permissions of the admin user.
   */
  private async findAdminUserPermissions() {
    const permissions = await this.databaseService.permission.findMany({
      where: { deleted: false, status: EPermissionStatus.ENABLED },
    });
    return permissions.map((permission) =>
      Object.assign(permission, { roles: [{ value: permission.action }] }),
    );
  }

  /**
   * Finds the role of the currently signed-in user.
   */
  private async findSignedInUserRole() {
    const accessToken = await this.tokenService.findAccessToken();
    const { roleId } = await this.tokenService.verifyAccessToken(accessToken);
    return await this.databaseService.role.findFirst({
      where: { clientId: roleId },
    });
  }

  /**
   * Updates the admin role cache
   */
  private getAdminRole = async () => {
    let adminRole: Model.Role | null =
      (await cache.get(ADMIN_ROLE_CACHE_KEY)) ?? null;

    if (!adminRole) {
      adminRole = await this.databaseService.role.findUnique({
        where: { code: ERole.ADMIN },
      });

      await cache.set(ADMIN_ROLE_CACHE_KEY, adminRole);
    }

    return adminRole!;
  };

  /**
   * Checks if a role is an admin role.
   */
  private isAdminRole = async (roleWhereInput: Prisma.RoleWhereUniqueInput) => {
    const adminRole = await this.getAdminRole();
    return Object.entries(roleWhereInput).every(
      ([key, value]) => adminRole?.[key] === value,
    );
  };

  /**
   * Checks if the input user is signed-in user.
   */
  private isSignedInUser = async (user: Pick<Model.User, 'clientId'>) => {
    return this.request.signedInInfo.userId === user.clientId;
  };

  /**
   * Checks if the signed-in user is admin role.
   */
  private isSignedInUserAdminRole = async () => {
    return await this.isAdminRole({
      clientId: this.request.signedInInfo.roleId,
    });
  };
}
