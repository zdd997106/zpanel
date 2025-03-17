import { Controller } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { DatabaseService } from 'src/database';

import { AppReportService } from './app-report.service';

// ----------

@Controller()
export class AppKeysScheduleController {
  constructor(
    private readonly dbs: DatabaseService,
    private readonly appReportService: AppReportService,
  ) {}

  // --- SCHEDULE:  ---

  @Cron('0 0 */2 * * *') // Every 2 hours
  async generateReportsForTooManyLogs() {
    // Finds all unused media
    const appKeys = await this.dbs.appKey.findMany({
      select: {
        kid: true,
        _count: { select: { logs: true } },
      },
      where: { deleted: false },
    });

    await Promise.all(
      appKeys.map(async (appKey) => {
        if (appKey._count.logs >= 100) {
          await this.appReportService.generateReport(appKey);
        }
      }),
    );
  }

  @Cron('0 0 0 * * *') // Every day
  async generateReportsForExpiredKeys() {
    // Finds all unused media
    const appKeys = await this.dbs.appKey.findMany({
      select: { kid: true },
      where: { expiresAt: { lte: new Date() }, deleted: false },
    });

    await Promise.all(
      appKeys.map(async (appKey) => {
        await this.appReportService.generateReport(appKey);
      }),
    );
  }
}
