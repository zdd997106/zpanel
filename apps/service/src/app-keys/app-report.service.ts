import { countBy, get, uniq } from 'lodash';
import { Injectable } from '@nestjs/common';

import { DatabaseService, Model } from 'modules/database';

// ----- CONSTANTS -----

const TEN_MINUTES = 1000 * 60 * 10;

// ----------

@Injectable()
export class AppReportService {
  constructor(private readonly dbs: DatabaseService) {}

  public generateReport = async (appKey: Pick<Model.AppKey, 'kid'>) => {
    await this.dbs.$transaction(async (tx) => {
      const logs = await tx.appLog.findMany({
        where: { appKeyId: appKey.kid },
      });

      if (logs.length === 0) return;

      await tx.appLog.deleteMany({
        where: { appKeyId: appKey.kid },
      });

      const paths = uniq(logs.map((log) => log.path));

      const entries = paths
        .map((path) => ({
          path,
          logs: logs.filter((log) => log.path === path),
        }))
        .map(({ path, logs }) => {
          return [path, this.summary(logs)] as const;
        });

      await tx.appReport.create({
        data: {
          appKey: { connect: { kid: appKey.kid } },
          data: JSON.stringify(Object.fromEntries(entries)),
        },
      });
    });
  };

  private summary = (logs: Model.AppLog[]) => {
    const status = countBy(logs, 'status');
    const method = countBy(logs, 'method');
    const ipAddress = countBy(filterEmpty(logs, 'ipAddress'), 'ipAddress');
    const userAgent = countBy(filterEmpty(logs, 'userAgent'), 'userAgent');
    const referer = countBy(filterEmpty(logs, 'referer'), 'referer');
    const origin = countBy(filterEmpty(logs, 'origin'), 'origin');

    const duration = countBy(
      filterEmpty(logs, 'duration'),
      (log) => Math.floor(log.duration / 50) * 50,
    );

    const time = countBy(
      logs,
      (log) => Math.floor(log.createdAt.getTime() / TEN_MINUTES) * TEN_MINUTES,
    );

    return {
      duration,
      status,
      method,
      ipAddress,
      userAgent,
      time,
      referer,
      origin,
    };
  };
}

// ----- HELPERS -----

function filterEmpty<T, TKey extends keyof T>(items: T[], key: TKey) {
  return items.filter(
    (value): value is T & Record<TKey, NonNullable<T[TKey]>> =>
      !!get(value, key),
  );
}
