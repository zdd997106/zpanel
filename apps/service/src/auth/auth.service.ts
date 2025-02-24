import CryptoJS from 'crypto-js';
import { Request } from 'express';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { REQUEST } from '@nestjs/core';
import { createCache } from 'cache-manager';
import { EPermissionStatus, ERole } from '@zpanel/core';

import { Model, DatabaseService } from 'src/database';

import { TokenService } from './token.service';
import { use } from 'utils';

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
    private readonly configService: ConfigService,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  public $transaction = use(() => this.databaseService.getTransactionMethod());

  public findUser = use(() => this.databaseService.user.findUnique);

  public createUser = use(() => this.databaseService.user.create);

  public findRole = use(() => this.databaseService.role.findFirst);

  public createApplication = use(() => this.databaseService.application.create);

  /**
   * Encode password for unique-hash value
   */
  public encodePassword(password: string) {
    return CryptoJS.SHA256(
      [password, this.configService.getOrThrow('PASSWORD_SECRET_KEY')].join(
        ':',
      ),
    ).toString();
  }

  /**
   * Retrieves signed-in information.
   */
  async getSignedInInfo() {
    const accessToken = await this.tokenService.findAccessToken();
    return await this.tokenService.verifyAccessToken(accessToken);
  }

  /**
   * Finds the user currently signed in.
   */
  async findSignedInUser() {
    return await this.databaseService.user.findFirst({
      where: { clientId: this.request.signedInInfo.userId },
      include: { role: true, avatar: true },
    });
  }

  /**
   * Finds permissions of the currently signed-in user.
   */
  async findSignedInUserPermissions() {
    const RoleWhereUniqueInput = { clientId: this.request.signedInInfo.roleId };

    return await this.databaseService.permission.findMany({
      where: {
        deleted: false,
        status: EPermissionStatus.ENABLED,
        roles: { some: { role: RoleWhereUniqueInput } },
      },
      include: {
        roles: {
          select: { value: true },
          where: { role: RoleWhereUniqueInput },
        },
      },
    });
  }

  /**
   * Finds permissions of the admin user.
   */
  async findAdminUserPermissions() {
    const permissions = await this.databaseService.permission.findMany({
      where: { deleted: false, status: EPermissionStatus.ENABLED },
    });
    return permissions.map((permission) =>
      Object.assign(permission, { roles: [{ value: permission.value }] }),
    );
  }

  /**
   * Finds the role of the currently signed-in user.
   */
  async findSignedInUserRole() {
    const accessToken = await this.tokenService.findAccessToken();
    const { roleId } = await this.tokenService.verifyAccessToken(accessToken);
    return await this.databaseService.role.findFirst({
      where: { clientId: roleId },
    });
  }

  /**
   * Updates the admin role cache
   */
  public getAdminRole = async () => {
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
  public isAdminRole = async (roleWhereInput: Prisma.RoleWhereUniqueInput) => {
    const adminRole = await this.getAdminRole();
    return Object.entries(roleWhereInput).every(
      ([key, value]) => adminRole?.[key] === value,
    );
  };

  /**
   * Checks if the input user is signed-in user.
   */
  public isSignedInUser = async (user: Pick<Model.User, 'clientId'>) => {
    return this.request.signedInInfo.userId === user.clientId;
  };

  /**
   * Checks if the signed-in user is admin role.
   */
  public isSignedInUserAdminRole = async () => {
    return await this.isAdminRole({
      clientId: this.request.signedInInfo.roleId,
    });
  };
}
