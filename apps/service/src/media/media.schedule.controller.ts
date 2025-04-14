import { Controller } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { DatabaseService } from 'modules/database';

import { S3Service } from './s3.service';

// ----------

@Controller()
export class MediaScheduleController {
  constructor(
    private readonly dbs: DatabaseService,
    private readonly s3Service: S3Service,
  ) {}

  // --- SCHEDULE: UNUSED MEDIA FILES COLLECTING ---

  @Cron('0 0 * * * *') // Every hour
  async cleanUpUnusedMediaFiles() {
    // Finds all unused media
    const unusedMediaList = await this.dbs.media.findMany({
      where: {
        objects: { none: {} },
        avatarUsers: { none: {} },
        createdAt: {
          lt: new Date(Date.now() - 60 * 60 * 1000), // before 1 hour ago
        },
      },
      take: 100,
    });

    // Removes all unused media from could storage
    await Promise.all(
      unusedMediaList.map(async (item) => {
        await this.s3Service.delete(item.clientId);
        await this.dbs.media.delete({ where: { clientId: item.clientId } });
      }),
    );
  }
}
