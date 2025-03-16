import {
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UpdateAppKeyDto, CreateAppKeyDto, ERole } from '@zpanel/core';

import { Inspector } from 'utils';
import { DatabaseService } from 'src/database';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

// ----------

@Injectable()
export class AppKeysService {
  constructor(
    private readonly dbs: DatabaseService,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  public findAllAppKeys = async () => {
    return await this.dbs.appKey.findMany({
      include: {
        owner: true,
        lastModifier: true,
        logs: { take: 1, orderBy: { lid: 'desc' } },
      },
      where: {
        deleted: false,
      },
      orderBy: { kid: 'asc' },
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

  public getAppKey = async (id: string) => {
    return await new Inspector(
      this.dbs.appKey.findUnique({
        where: { deleted: false, clientId: id },
      }),
    ).essential();
  };

  public createAppKey = async ({
    origins,
    allowPaths,
    ...createAppKeyDto
  }: CreateAppKeyDto) => {
    await this.dbs.appKey.create({
      data: {
        ...createAppKeyDto,
        owner: { connect: { clientId: this.request.signedInInfo.userId } },
        origins: JSON.stringify(origins),
        allowPaths: JSON.stringify(allowPaths),
      },
    });
  };

  public updateAppKey = async (
    id: string,
    { ...updateAppKeyDto }: UpdateAppKeyDto,
  ) => {
    const appKey = await new Inspector(
      this.dbs.appKey.findUnique({
        where: { clientId: id },
      }),
    ).essential();

    const operator = await new Inspector(
      this.dbs.user.findUnique({
        select: { uid: true, role: { select: { code: true } } },
        where: { clientId: this.request.signedInInfo.userId },
      }),
    )
      .essential()
      .otherwise(() => new UnauthorizedException());

    if (operator.role.code !== ERole.ADMIN) {
      await new Inspector(operator.uid === appKey.ownerId)
        .expect(true)
        .otherwise(() => new ForbiddenException());
    }

    await this.dbs.$transaction(async () => {
      await this.dbs.appKey.update({
        data: {
          ...updateAppKeyDto,
          origins: JSON.stringify(updateAppKeyDto.origins),
          allowPaths: JSON.stringify(updateAppKeyDto.allowPaths),
        },
        where: { kid: appKey.kid },
      });
    });
  };

  public deleteAppKey = async (id: string) => {
    const appKey = await new Inspector(
      this.dbs.appKey.findUnique({
        where: { clientId: id },
      }),
    ).essential();

    await this.dbs.appKey.update({
      data: { deleted: true },
      where: { kid: appKey.kid },
    });
  };
}
