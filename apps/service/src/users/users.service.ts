import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { omit } from 'lodash';
import { ConfigService } from '@nestjs/config';
import { REQUEST } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import {
  CreateUserDto,
  ENotificationStatus,
  FindUserNotificationsCountDto,
  FindUserNotificationsDto,
  FindUsersDto,
  RequestToUpdateUserEmailDto,
  UpdateUserProfileDto,
  UpdateUserDto,
  UpdateUserEmailDto,
  UpdateUserPasswordDto,
  UpdateUsersNotificationsAllDto,
  UpdateUsersNotificationsDto,
} from '@zpanel/core';
import { Request } from 'express';

import { createValidationError, encodePassword, Inspector } from 'utils';
import { DatabaseService, Model } from 'modules/database';
import { MailService } from 'modules/mail';

@Injectable()
export class UsersService {
  constructor(
    private readonly dbs: DatabaseService,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(REQUEST) private readonly req: Request,
  ) {}

  public async findUsers(findUsersDto: FindUsersDto) {
    const whereInput: Prisma.UserWhereInput = {
      deleted: false,
      AND: {
        ...(findUsersDto.name && {
          name: { contains: findUsersDto.name, mode: 'insensitive' },
        }),
        ...(findUsersDto.account && {
          account: { contains: findUsersDto.account, mode: 'insensitive' },
        }),
        ...(findUsersDto.email && {
          email: { contains: findUsersDto.email, mode: 'insensitive' },
        }),
        ...(findUsersDto.role && {
          role: { code: findUsersDto.role },
        }),
        ...(findUsersDto.status && { status: findUsersDto.status }),
      },
    };

    const users = await this.dbs.user.findMany({
      include: { avatar: true, role: true },
      where: whereInput,
      take: findUsersDto.limit,
      skip: findUsersDto.limit * (findUsersDto.page - 1),
      orderBy: findUsersDto.orderBy
        ? { [findUsersDto.orderBy]: findUsersDto.order }
        : { uid: 'desc' },
    });

    const count = await this.dbs.user.count({ where: whereInput });

    return { users, count };
  }

  public async createUser(createUserDto: CreateUserDto) {
    const role = await this.verifyUserRole(createUserDto);
    const avatar = await this.verifyUserAvatar(createUserDto);

    const user = await this.dbs.user.create({
      select: { uid: true },
      data: {
        ...omit(createUserDto, ['avatar', 'role']),
        password: encodePassword(createUserDto.password, 0), // [NOTE] Temporary password, will be updated later
        avatarId: avatar?.mid,
        roleId: role.rid,
      },
    });

    await this.dbs.user.update({
      data: { password: encodePassword(createUserDto.password, user.uid) },
      where: { uid: user.uid },
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

  public async updateUserProfile(
    id: string,
    updateUserProfileDto: UpdateUserProfileDto,
  ) {
    const user = await this.findTargetUser(id);
    const avatar = await this.verifyUserAvatar(updateUserProfileDto);

    await this.dbs.user.update({
      data: {
        ...omit(updateUserProfileDto, 'avatar'),
        avatarId: avatar ? avatar.mid : null,
      },
      where: { uid: user.uid },
    });
  }

  public async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findTargetUser(id);
    const role = await this.verifyUserRole(updateUserDto);
    const avatar = await this.verifyUserAvatar(updateUserDto);

    const password = updateUserDto?.password
      ? encodePassword(updateUserDto.password, user.uid)
      : undefined;

    await this.dbs.user.update({
      data: {
        ...omit(updateUserDto, ['avatar', 'role']),
        password,
        avatarId: avatar?.mid,
        roleId: role.rid,
      },
      where: { uid: user.uid },
    });
  }

  public requestToUpdateUserEmail = async (
    id: string,
    requestToUpdateUserEmailDto: RequestToUpdateUserEmailDto,
  ) => {
    await this.verifyEmailUnique(requestToUpdateUserEmailDto);

    const newEmail = requestToUpdateUserEmailDto.email;
    const user = await this.findTargetUser(id);
    const token = await this.getUpdateUserEmailToken(user, newEmail);

    await this.mailService.sendUpdateUserEmailConfirmation(user.email!, {
      name: user.name,
      newEmail: newEmail,
      token,
    });
  };

  public updateUserEmail = async (
    id: string,
    updateUserEmailDto: UpdateUserEmailDto,
  ) => {
    let requestInfo: ReturnType<typeof this.verifyUpdateUserEmailToken>;

    try {
      requestInfo = this.verifyUpdateUserEmailToken(updateUserEmailDto);

      const user = await this.findTargetUser(requestInfo.user);
      await new Inspector(user.email === requestInfo.old).expect(true);
      await new Inspector(user.clientId === id).expect(true);
      await this.equalToSignedInUser(user);
      await this.verifyEmailUnique({ email: requestInfo.new });
    } catch {
      throw new ForbiddenException('The provided token is invalid or expired');
    }

    await this.dbs.user.update({
      data: { email: requestInfo.new },
      where: { clientId: requestInfo.user },
    });
  };

  public discountUserEmail = async (id: string) => {
    const user = await this.findTargetUser(id);

    await this.dbs.user.update({
      data: { email: null },
      where: { uid: user.uid },
    });
  };

  public updateUserPassword = async (
    id: string,
    updateUserPasswordDto: UpdateUserPasswordDto,
  ) => {
    const user = await this.findTargetUser(id);

    await new Inspector(user.clientId === this.req.signedInInfo.userId)
      .expect(true)
      .otherwise(() => new ForbiddenException());

    const password = encodePassword(updateUserPasswordDto.password, user.uid);
    await this.dbs.user.update({
      data: { password },
      where: { clientId: id },
    });
  };

  public findAppKeysByUser = async (id: string) => {
    const user = await this.findTargetUser(id);

    return await this.dbs.appKey.findMany({
      include: {
        owner: true,
        lastModifier: true,
        logs: { take: 1, orderBy: { lid: 'desc' } },
      },
      where: { deleted: false, ownerId: user.uid },
      orderBy: { kid: 'asc' },
    });
  };

  public async findUserNotifications(
    id: string,
    findUserNotificationsDto: FindUserNotificationsDto,
  ) {
    const user = await this.findTargetUser(id);

    const whereInput: Prisma.UserNotificationWhereInput = {
      userId: user.uid,
      status: { not: ENotificationStatus.DELETED },

      AND: {
        status: findUserNotificationsDto.status,
        notification: findUserNotificationsDto.type && {
          type: findUserNotificationsDto.type,
        },
      },
    };

    const notifications = await this.dbs.userNotification.findMany({
      include: { notification: { include: { sender: true } } },
      where: whereInput,
      orderBy: findUserNotificationsDto.orderBy
        ? { [findUserNotificationsDto.orderBy]: 'desc' }
        : { notificationId: 'desc' },
      skip:
        findUserNotificationsDto.limit * (findUserNotificationsDto.page - 1),
      take: findUserNotificationsDto.limit,
    });

    const count = await this.dbs.userNotification.count({
      where: whereInput,
    });

    await this.markAsReceived(notifications);

    return { notifications, count };
  }

  public async findUserNotificationCount(
    id: string,
    findUserNotificationsCountDto: FindUserNotificationsCountDto,
  ) {
    const user = await this.findTargetUser(id);
    const status =
      typeof findUserNotificationsCountDto.status === 'string'
        ? findUserNotificationsCountDto.status
            .split(',')
            .map((status) => Number(status.trim()))
        : findUserNotificationsCountDto.status;

    return await this.dbs.userNotification.count({
      where: {
        userId: user.uid,
        status: Array.isArray(status) ? { in: status } : status,
        AND: { status: { not: ENotificationStatus.DELETED } },
      },
    });
  }

  public async findLatestUserNotifications(id: string) {
    const user = await this.findTargetUser(id);

    const notifications = await this.dbs.userNotification.findMany({
      include: { notification: true },
      where: { userId: user.uid, status: { not: ENotificationStatus.DELETED } },
      orderBy: { notificationId: 'desc' },
      take: 5, // [TODO] make it configurable
    });

    await this.markAsReceived(notifications);

    return notifications;
  }

  public async updateUserNotifications(
    id: string,
    updateUsersNotificationsDto: UpdateUsersNotificationsDto,
  ) {
    const user = await this.findTargetUser(id);

    const isReading =
      updateUsersNotificationsDto.status === ENotificationStatus.READ;
    const editableStatus = this.getEditableStatus(
      updateUsersNotificationsDto.status,
    );

    await this.dbs.userNotification.updateMany({
      data: {
        status: updateUsersNotificationsDto.status,
        ...(isReading && { readAt: new Date() }),
      },
      where: {
        userId: user.uid,
        notification: { clientId: { in: updateUsersNotificationsDto.ids } },
        status: { in: editableStatus },
      },
    });
  }

  public async updateUserNotificationsAll(
    id: string,
    updateUsersNotificationsAllDto: UpdateUsersNotificationsAllDto,
  ) {
    const user = await this.findTargetUser(id);

    const isReading =
      updateUsersNotificationsAllDto.status === ENotificationStatus.READ;
    const editableStatus = this.getEditableStatus(
      updateUsersNotificationsAllDto.status,
    );

    await this.dbs.userNotification.updateMany({
      data: {
        status: updateUsersNotificationsAllDto.status,
        ...(isReading && { readAt: new Date() }),
      },
      where: { userId: user.uid, status: { in: editableStatus } },
    });
  }

  public async deleteUser(id: string) {
    const user = await this.findTargetUser(id);

    const overwrites = { email: null, account: `${user.uid} ${user.account}` };
    await this.dbs.user.update({
      data: { ...overwrites, deleted: true },
      where: { uid: user.uid },
    });

    if (user.email) {
      await this.mailService.sendUserDeletedNotify(user.email, {
        name: user.name,
        account: user.account,
      });
    }
  }

  public getUserOptions = async () => {
    return await this.dbs.user.findMany({
      select: { clientId: true, email: true, name: true },
      orderBy: { name: 'asc' },
    });
  };

  // --- PRIVATE ---

  private findTargetUser = (id: string) => {
    return new Inspector(
      this.dbs.user.findUnique({
        select: {
          uid: true,
          clientId: true,
          email: true,
          name: true,
          account: true,
        },
        where: { clientId: id, deleted: false },
      }),
    ).essential();
  };

  private async verifyUserRole(dto: { role: string }) {
    return await new Inspector(
      this.dbs.role.findUnique({
        select: { rid: true },
        where: { code: dto.role, deleted: false },
      }),
    )
      .essential()
      .otherwise(() => createValidationError(['role'], 'Role not found'));
  }

  private async verifyUserAvatar(dto: { avatar: null | { id: string } }) {
    if (!dto.avatar) return null;
    return await new Inspector(
      this.dbs.media.findUnique({
        select: { mid: true },
        where: { clientId: dto.avatar.id },
      }),
    )
      .essential()
      .otherwise(() => createValidationError(['avatar'], 'Avatar not found'));
  }

  private async verifyEmailUnique(dto: { email: string }) {
    return await new Inspector(
      this.dbs.user.findFirst({
        select: { uid: true },
        where: { email: dto.email },
      }),
    )
      .expect(null)
      .otherwise(() =>
        createValidationError(['email'], 'Email already exists'),
      );
  }

  private verifyUpdateUserEmailToken = (dto: { token: string }) => {
    const secret = this.getUpdateEmailSecret();
    type UpdateUserEmailToken = { user: string; old: string; new: string };
    return this.jwtService.verify<UpdateUserEmailToken>(dto.token, { secret });
  };

  private getUpdateUserEmailToken = async (
    user: Pick<Model.User, 'email' | 'clientId'>,
    newEmail: string,
  ) => {
    const secret = this.getUpdateEmailSecret();
    return this.jwtService.signAsync(
      { user: user.clientId, old: user.email, new: newEmail },
      { expiresIn: '1 day', secret },
    );
  };

  private getEditableStatus = (() => {
    // [NOTE] status flow: SEND -> RECEIVED -> READ -> DELETED
    const EStatus = ENotificationStatus;
    const editableStatusMap = new Map([
      [EStatus.RECEIVED, [EStatus.SEND]],
      [EStatus.READ, [EStatus.RECEIVED, EStatus.SEND]],
      [EStatus.DELETED, [EStatus.READ, EStatus.RECEIVED, EStatus.SEND]],
    ]);

    return (status: ENotificationStatus) => editableStatusMap.get(status) || [];
  })();

  private markAsReceived = async (
    userNotifications: Model.UserNotification[],
  ) => {
    // [NOTE] Mark as RECEIVED if the status is SEND
    const unresolvedNotificationIds = userNotifications
      .filter(
        (notification) => notification.status === ENotificationStatus.SEND,
      )
      .map((notification) => notification.notificationId);

    if (unresolvedNotificationIds.length > 0) {
      await this.dbs.userNotification.updateMany({
        data: { status: ENotificationStatus.RECEIVED },
        where: { notificationId: { in: unresolvedNotificationIds } },
      });
    }
  };

  private getUpdateEmailSecret() {
    return [
      this.configService.getOrThrow('JWT_SECRET_KEY'),
      'EMAIL_TOKEN',
    ].join(':');
  }
}
