import { Request } from 'express';
import {
  Injectable,
  CanActivate,
  Inject,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { UAParser } from 'ua-parser-js';
import { EAppKeyStatus } from '@zpanel/core';

import { Inspector } from 'utils';

import { DatabaseService, Model } from 'src/database';

// ----------

/**
 * Guard to protect routes based on user authentication.
 */
@Injectable()
export class AppKeyGuard implements CanActivate {
  constructor(
    private readonly dbs: DatabaseService,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  static Control() {
    return UseGuards(AppKeyGuard);
  }

  /**
   * Determines whether the request is authorized.
   */
  async canActivate(): Promise<boolean> {
    if (this.findKey()) {
      await this.verify();
      void this.record();
    }

    return true;
  }

  /**
   * Authenticate based on user's signed-in status.
   */
  private async verify() {
    // Overwrite signedInInfo with appKey info to pretend as a signed-in user
    this.request.signedInInfo = await (async () => {
      const appKey = await new Inspector(
        this.dbs.appKey.findUnique({
          include: {
            owner: {
              select: {
                clientId: true,
                role: { select: { clientId: true } },
              },
            },
          },
          where: {
            key: this.findKey()!,
            deleted: false,
            status: EAppKeyStatus.ENABLED,
          },
        }),
      )
        .essential()
        .otherwise(() => new ForbiddenException('Invalid API key'));

      await this.verifyExpiration(appKey);
      await this.verifyAllowPaths(appKey);
      await this.verifyOrigin(appKey);

      return {
        userId: appKey.owner.clientId,
        roleId: appKey.owner.role.clientId,
      };
    })();
  }

  // ----- PRIVATE -----

  private findKey() {
    return this.request.header('x-api-key');
  }

  private async verifyAllowPaths(appKey: Model.AppKey) {
    const allowPaths = JSON.parse(appKey.allowPaths) as string[];

    await new Inspector(
      allowPaths.some((path) =>
        new RegExp(`^${path.replace(/\*/g, '.*')}$`).test(this.request.path),
      ),
    )
      .expect(true)
      .otherwise(() => new ForbiddenException('Invalid API key'));
  }

  private async verifyOrigin(appKey: Model.AppKey) {
    const origins = JSON.parse(appKey.origins) as string[];

    await new Inspector(
      origins.some((test) => test === this.request.header('origin')),
    )
      .expect(true)
      .otherwise(() => new ForbiddenException('Invalid API key'));
  }

  private async verifyExpiration(appKey: Model.AppKey) {
    if (!appKey.expiresAt) return;

    try {
      await new Inspector(new Date(appKey.expiresAt) > new Date())
        .expect(true)
        .otherwise(() => new ForbiddenException('Invalid API key'));
    } catch (error) {
      await this.dbs.appKey.update({
        data: { deleted: true },
        where: { kid: appKey.kid },
      });

      throw error;
    }
  }

  private async record() {
    const timeStart = new Date().getTime();
    await new Promise((resolve) => this.request.res!.on('finish', resolve));
    const timeEnd = new Date().getTime();

    const ua = UAParser(this.request.header('user-agent'));

    await this.dbs.appLog.create({
      data: {
        appKey: { connect: { key: this.findKey()! } },
        path: this.request.path,
        method: this.request.method,
        status: this.request.res!.statusCode,
        origin: this.request.header('origin') || '',
        ipAddress: this.request.ip,
        duration: timeEnd - timeStart,
        userAgent: JSON.stringify({
          browser: ua.browser.name,
          browserVersion: ua.browser.version,
          os: ua.os.name,
          osVersion: ua.os.version,
          deviceType: ua.device.type,
          engine: ua.engine.name,
        }),
      },
    });
  }
}
