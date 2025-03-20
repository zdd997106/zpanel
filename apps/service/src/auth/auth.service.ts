import { Request } from 'express';
import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import {
  EApplicationStatus,
  EPermissionStatus,
  ERole,
  SignInDto,
  SignUpDto,
} from '@zpanel/core';

import { createValidationError, encodePassword, Inspector } from 'utils';
import { Model, DatabaseService } from 'modules/database';

import { TokenService } from 'modules/guards';

// ----------

@Injectable()
export class AuthService {
  constructor(
    private readonly dbs: DatabaseService,
    private readonly tokenService: TokenService,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  public signIn = async (signInDto: SignInDto) => {
    const { email } = signInDto;

    const user = await new Inspector(
      this.dbs.user.findUnique({
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
      this.dbs.user.findFirst({
        where: { email: signUpDto.email },
      }),
    )
      .expect(null)
      .otherwise(() =>
        createValidationError(['email'], 'Email has registered'),
      );

    const application = await this.dbs.application.findUnique({
      where: { email: signUpDto.email },
    });

    if (application) {
      const reviewed = application.status !== EApplicationStatus.UNREVIEWED;
      await this.dbs.application.update({
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
      await this.dbs.application.create({
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
      this.dbs.user.findFirst({
        where: { clientId: this.request.signedInInfo.userId },
        include: { role: true, avatar: true },
      }),
    )
      .essential()
      .otherwise(() => new UnauthorizedException());
  }

  public getRolePermissions = async () => {
    const roleId = await this.request.signedInInfo.roleId;
    const role = await new Inspector(
      this.dbs.role.findUnique({
        where: { clientId: roleId },
      }),
    )
      .essential()
      .otherwise(() => new UnauthorizedException());

    if (role.code === ERole.ADMIN) {
      const permissions = await this.dbs.permission.findMany({
        where: {
          deleted: false,
          status: EPermissionStatus.ENABLED,
        },
      });
      return permissions.map((permission) => ({
        permission,
        action: permission.action,
      }));
    }

    const rolePermissions = await this.dbs.rolePermission.findMany({
      include: { permission: true },
      where: {
        roleId: role.rid,
        permission: { deleted: false, status: EPermissionStatus.ENABLED },
      },
    });

    return rolePermissions;
  };

  /**
   * Encode password for unique-hash value
   */
  private async verifyPassword(user: Model.User, password: string) {
    return user.password === encodePassword(password, user.uid);
  }
}
