import {
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { UpdateAppKeyDto, CreateAppKeyDto, ERole } from '@zpanel/core';

import { Inspector } from 'utils';
import { DatabaseService } from 'src/database';

import { AppReportService } from './app-report.service';

// ----------

@Injectable()
export class AppKeysService {
  constructor(
    private readonly dbs: DatabaseService,
    private readonly appReportService: AppReportService,
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

  public getAppKey = async (id: string) => {
    return await new Inspector(
      this.dbs.appKey.findUnique({
        where: { deleted: false, clientId: id },
      }),
    ).essential();
  };

  public createAppKey = async ({
    allowPaths,
    ...createAppKeyDto
  }: CreateAppKeyDto) => {
    const signedUserId = this.request.signedInInfo.userId;
    await this.dbs.appKey.create({
      data: {
        ...createAppKeyDto,
        owner: { connect: { clientId: signedUserId } },
        lastModifier: { connect: { clientId: signedUserId } },
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
          allowPaths: JSON.stringify(updateAppKeyDto.allowPaths),
          lastModifierId: operator.uid,
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

    await this.dbs.$transaction(async (tx) => {
      await tx.appKey.update({
        data: { deleted: true },
        where: { kid: appKey.kid },
      });

      await this.appReportService.generateReport(appKey);
    });
  };
}
