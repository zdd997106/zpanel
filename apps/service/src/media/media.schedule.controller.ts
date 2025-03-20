import { Controller } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { EMediaStatus } from '@zpanel/core';

import { DatabaseService } from 'modules/database';

// ----------

@Controller()
export class MediaScheduleController {
  constructor(private readonly dbs: DatabaseService) {}

  // --- SCHEDULE: UNUSED MEDIA FILES COLLECTING ---

  @Cron('0 0 * * * *') // Every hour
  async cleanUpUnusedMediaFiles() {
    // Finds all unused media
    const unusedMediaList = await this.dbs.media.findMany({
      where: { status: EMediaStatus.UNUSED },
    });

    // Removes all unused media from could storage
    await Promise.all(
      unusedMediaList.map((item) =>
        this.dbs.media.delete({ where: { clientId: item.clientId } }),
      ),
    );
  }
}
