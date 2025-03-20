import {
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { REQUEST } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import {
  RequestToUpdateUserEmailDto,
  UpdateUserDto,
  UpdateUserEmailDto,
  UpdateUserPasswordDto,
  UpdateUserRoleDto,
} from '@zpanel/core';
import { Request } from 'express';

import { createValidationError, encodePassword, Inspector } from 'utils';
import { DatabaseService, Model } from 'src/database';
import { MailService } from 'src/mail';

@Injectable()
export class UsersService {
  constructor(
    private readonly dbs: DatabaseService,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(REQUEST) private readonly req: Request,
  ) {}

  public async findAllUsers() {
    return await this.dbs.user.findMany({
      include: { avatar: true, role: true },
      orderBy: { uid: 'asc' },
    });
  }

  public async findUser(id: string) {
    return await new Inspector(
      this.dbs.user.findUnique({
        include: { avatar: true, role: true },
        where: { clientId: id },
      }),
    ).essential();
  }

  public async equalToSignedInUser(user: Pick<Model.User, 'clientId'>) {
    await new Inspector(user.clientId === this.req.signedInInfo.userId);
  }

  public async updateUser(
    id: string,
    { avatar, ...updateUserDto }: UpdateUserDto,
  ) {
    const user = await new Inspector(
      this.dbs.user.findUnique({
        select: { uid: true },
        where: { clientId: id },
      }),
    ).essential();

    await this.dbs.user.update({
      data: {
        ...updateUserDto,
        ...(avatar
          ? { avatar: { connect: { clientId: avatar.id } } }
          : { avatarId: null }),
      },
      where: { uid: user.uid },
    });
  }

  public updateUserRole = async (
    id: string,
    updateUserRoleDto: UpdateUserRoleDto,
  ) => {
    const user = await new Inspector(
      this.dbs.user.findUnique({ where: { clientId: id } }),
    ).essential();

    const role = await new Inspector(
      this.dbs.role.findUnique({ where: { code: updateUserRoleDto.role } }),
    )
      .essential()
      .otherwise(() => createValidationError(['role'], 'Role not found'));

    await this.dbs.user.update({
      data: { roleId: role.rid },
      where: { uid: user.uid },
    });
  };

  public requestToUpdateUserEmail = async (
    id: string,
    requestToUpdateUserEmailDto: RequestToUpdateUserEmailDto,
  ) => {
    await new Inspector(
      this.dbs.user.findUnique({
        where: { email: requestToUpdateUserEmailDto.email },
      }),
    )
      .expect(null)
      .otherwise(() =>
        createValidationError(['email'], 'Email already exists'),
      );

    const user = await new Inspector(
      this.dbs.user.findUnique({ where: { clientId: id } }),
    ).essential();

    const token = await this.jwtService.signAsync(
      {
        user: user.clientId,
        new: requestToUpdateUserEmailDto.email,
        old: user.email,
      },
      {
        expiresIn: '1 day',
        secret: this.getJWTSecret(),
      },
    );

    await this.mailService.sendUpdateUserEmailConfirmation(user.email, {
      name: user.name,
      newEmail: requestToUpdateUserEmailDto.email,
      token,
    });
  };

  public updateUserEmail = async (updateUserEmailDto: UpdateUserEmailDto) => {
    let requestInfo: { user: string; new: string; old: string };

    try {
      requestInfo = this.jwtService.verify(updateUserEmailDto.token, {
        secret: this.getJWTSecret(),
      });

      const user = await new Inspector(
        this.dbs.user.findUnique({
          where: { clientId: requestInfo.user, email: requestInfo.old },
        }),
      ).essential();

      await this.equalToSignedInUser(user);

      await new Inspector(
        this.dbs.user.findUnique({ where: { email: requestInfo.new } }),
      ).expect(null);
    } catch {
      throw new ForbiddenException('The provided token is invalid or expired');
    }

    await this.dbs.user.update({
      data: { email: requestInfo.new },
      where: { clientId: requestInfo.user },
    });
  };

  public updateUserPassword = async (
    updateUserPasswordDto: UpdateUserPasswordDto,
  ) => {
    const user = await new Inspector(
      this.dbs.user.findUnique({
        select: { uid: true },
        where: { clientId: this.req.signedInInfo.userId },
      }),
    )
      .essential()
      .otherwise(() => new UnauthorizedException());

    await this.dbs.user.update({
      data: {
        password: encodePassword(updateUserPasswordDto.password, user.uid),
      },
      where: { uid: user.uid },
    });
  };

  public findAppKeysByUser = async (userId: string) => {
    return await this.dbs.appKey.findMany({
      include: {
        owner: true,
        lastModifier: true,
        logs: { take: 1, orderBy: { lid: 'desc' } },
      },
      where: {
        deleted: false,
        owner: { clientId: userId },
      },
      orderBy: { kid: 'asc' },
    });
  };

  // --- PRIVATE ---

  private getJWTSecret = () => {
    return `${this.configService.getOrThrow('JWT_SECRET_KEY')}:EMAIL_TOKEN`;
  };
}
