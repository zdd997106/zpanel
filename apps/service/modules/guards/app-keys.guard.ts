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
import { DatabaseService, Model } from 'modules/database';

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
    const key = this.findKey();
    if (key) {
      await this.verify(key);
      await this.record();
      this.request.protections = { ...this.request.protections, appKey: true };
    }

    return true;
  }

  /**
   * Authenticate based on user's signed-in status.
   */
  private async verify(key: string) {
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
            key,
            deleted: false,
            status: EAppKeyStatus.ENABLED,
          },
        }),
      )
        .essential()
        .otherwise(() => new ForbiddenException('Invalid API key'));

      await this.verifyExpiration(appKey);
      await this.verifyAllowPaths(appKey);

      return {
        userId: appKey.owner.clientId,
        roleId: appKey.owner.role.clientId,
      };
    })();
  }

  // ----- PRIVATE -----

  private findKey() {
    return this.request.header('x-zpanel-protection-bypass');
  }

  private async verifyAllowPaths(appKey: Model.AppKey) {
    const allowPaths = JSON.parse(appKey.allowPaths) as string[];

    await new Inspector(
      allowPaths.some((pathPattern) => {
        const [method, path] = pathPattern
          .split(':')
          .map((part) => part.trim());
        return (
          this.request.method === method &&
          new RegExp(`^${path.replace(/\*/g, '.*')}$`).test(this.request.path)
        );
      }),
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

    const ua = UAParser(this.request.header('user-agent'));
    const res = this.request.res!;
    const log = await this.dbs.appLog.create({
      data: {
        appKey: { connect: { key: this.findKey()! } },
        path: this.request.path,
        method: this.request.method,
        origin: this.request.header('origin'),
        referer: this.request.header('referer'),
        ipAddress: this.request.ip,
        userAgent: JSON.stringify([
          ua.browser.name, // browser
          ua.browser.version, // browserVersion
          ua.os.name, // os
          ua.os.version, // osVersion
          ua.device.type, // deviceType
          ua.engine.name, // engine
        ]),
      },
    });

    res.on('finish', () => {
      const timeEnd = new Date().getTime();
      void this.dbs.appLog
        .update({
          data: {
            status: res.statusCode,
            duration: timeEnd - timeStart,
          },
          where: { lid: log.lid },
        })
        .then(() => {}); // [NOTE] Don't actually know why, but without this, the log will not be saved properly
    });
  }
}
