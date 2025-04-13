import { Request } from 'express';
import * as Crypto from 'crypto-js';
import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
  EApplicationStatus,
  EPermissionStatus,
  ERole,
  EUserStatus,
  RequestToResetPasswordDto,
  ResetPasswordDto,
  SignInDto,
  SignUpDto,
} from '@zpanel/core';

import { createValidationError, encodePassword, Inspector } from 'utils';
import { Model, DatabaseService } from 'modules/database';

import { TokenService } from 'modules/guards';
import { MailService } from 'modules/mail';

// ----------

@Injectable()
export class AuthService {
  constructor(
    private readonly dbs: DatabaseService,
    private readonly tokenService: TokenService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  public signIn = async (signInDto: SignInDto) => {
    const { account } = signInDto;

    const user = await new Inspector(
      this.dbs.user.findFirst({
        include: { role: { select: { clientId: true } } },
        where: { OR: [{ account }, { email: account }] },
      }),
    )
      .essential()
      .otherwise(
        () => new BadRequestException('Account or password is incorrect'),
      );

    await new Inspector(this.verifyPassword(user, signInDto.password))
      .expect(true)
      .otherwise(
        () => new BadRequestException('Account or password is incorrect'),
      );

    await new Inspector(user.status === EUserStatus.ACTIVE)
      .expect(true)
      .otherwise(
        () => new ForbiddenException('Your account has been disabled'),
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

  public requestToResetPassword = async (
    requestToResetPasswordDto: RequestToResetPasswordDto,
  ) => {
    const user = await new Inspector(
      this.dbs.user.findUnique({
        where: { account: requestToResetPasswordDto.email },
      }),
    )
      .essential()
      .otherwise(() =>
        createValidationError(['email'], 'The email is not registered'),
      );

    const token = await this.jwtService.signAsync(
      { email: user.email, signature: this.resetPasswordSignature(user) },
      { expiresIn: '1h', secret: this.resetPasswordJwtSecret() },
    );

    await this.mailService.sendPasswordResetEmail(user.email!, {
      token,
      name: user.name,
    });
  };

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { token, password } = resetPasswordDto;

    try {
      const { email, signature } = await this.jwtService.verifyAsync<{
        email: string;
        signature: string;
      }>(token, { secret: this.resetPasswordJwtSecret() });

      const user = await new Inspector(
        this.dbs.user.findFirst({ where: { email } }),
      ).essential();

      if (signature !== this.resetPasswordSignature(user)) throw new Error();

      await this.dbs.user.update({
        where: { uid: user.uid },
        data: { password: encodePassword(password, user.uid) },
      });
    } catch {
      throw new BadRequestException(
        'The token is invalid or expired. Please request a new password reset link.',
      );
    }
  }

  /**
   * Encode password for unique-hash value
   */
  private async verifyPassword(user: Model.User, password: string) {
    return user.password === encodePassword(password, user.uid);
  }

  private resetPasswordJwtSecret() {
    return [
      this.configService.getOrThrow('JWT_SECRET_KEY'),
      'RESETPASSWORD',
    ].join(':');
  }

  private resetPasswordSignature(user: Model.User) {
    const signature = Crypto.MD5(
      [user.uid, user.updatedAt, user.password].join(':'),
    ).toString(Crypto.enc.Hex);
    return signature;
  }
}
