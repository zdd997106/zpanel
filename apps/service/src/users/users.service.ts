import {
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { REQUEST } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import {
  ENotificationStatus,
  FindUserNotificationsCountDto,
  FindUserNotificationsDto,
  RequestToUpdateUserEmailDto,
  UpdateUserDto,
  UpdateUserEmailDto,
  UpdateUserPasswordDto,
  UpdateUserRoleDto,
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
    const user = await this.findTargetUser(
      this.req.signedInInfo.userId,
    ).otherwise(() => new UnauthorizedException());

    await this.dbs.user.update({
      data: {
        password: encodePassword(updateUserPasswordDto.password, user.uid),
      },
      where: { uid: user.uid },
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
      where: {
        deleted: false,
        ownerId: user.uid,
      },
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
      status: findUserNotificationsDto.status,

      ...(findUserNotificationsDto.type && {
        notification: { type: findUserNotificationsDto.type },
      }),

      AND: { status: { not: ENotificationStatus.DELETED } },
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

    return await this.dbs.userNotification.count({
      where: {
        userId: user.uid,
        status: findUserNotificationsCountDto.status,
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

    await this.dbs.userNotification.updateMany({
      data: {
        status: updateUsersNotificationsDto.status,
        ...(isReading && { readAt: new Date() }),
      },
      where: {
        userId: user.uid,
        notification: { clientId: { in: updateUsersNotificationsDto.ids } },
        status: {
          in: this.getEditableStatus(updateUsersNotificationsDto.status),
        },
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

    await this.dbs.userNotification.updateMany({
      data: {
        status: updateUsersNotificationsAllDto.status,
        ...(isReading && { readAt: new Date() }),
      },
      where: {
        userId: user.uid,
        status: {
          in: this.getEditableStatus(updateUsersNotificationsAllDto.status),
        },
      },
    });
  }

  // --- PRIVATE ---

  private getJWTSecret = () => {
    return `${this.configService.getOrThrow('JWT_SECRET_KEY')}:EMAIL_TOKEN`;
  };

  private findTargetUser = (id: string) => {
    return new Inspector(
      this.dbs.user.findUnique({
        select: { uid: true },
        where: { clientId: id },
      }),
    ).essential();
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
}
