import {
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Post,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { EMediaStatus } from '@zpanel/core';
import { MediaService } from './media.service';
import { TransformerService } from './transformer.service';

// ----- SETTINGS -----

const MAX_PROFILE_PICTURE_SIZE_IN_BYTES = 10 * 1024 * 1024; // 10 MB

const MEDIA_MAX_AGE = 60 * 60 * 1000;

// ----------

@Controller('media')
export class MediaController {
  constructor(
    private readonly mediaService: MediaService,
    private readonly transformerService: TransformerService,
  ) {}

  // --- GET: READ RESOURCE ---

  @Get(':id')
  async readFile(@Param('id') id: string, @Res() response: Response) {
    const url = await this.mediaService.generateMediaAccessUrl(id, {
      expiresIn: MEDIA_MAX_AGE,
    });
    response.setHeader(
      'Cache-Control',
      `public, max-age=${MEDIA_MAX_AGE / 1000}`,
    );
    response.redirect(url);
  }

  // --- POST: CREATE IMAGE RESOURCE ---

  @Post('images')
  @UseInterceptors(FilesInterceptor('files'))
  async updateImage(
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: 'image' })
        .addMaxSizeValidator({ maxSize: MAX_PROFILE_PICTURE_SIZE_IN_BYTES })
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
    )
    files: Express.Multer.File[],
  ) {
    const mediaList = await this.mediaService.createMany(files, {
      uploaderId: 1,
    });
    return mediaList.map(this.transformerService.toMediaDto);
  }

  // --- SCHEDULE: UNUSED MEDIA FILES COLLECTING ---

  @Cron('0 0 * * * *') // Every hour
  async cleanUpUnusedMediaFiles() {
    // Finds all unused media
    const unusedMediaList = await this.mediaService.findMany({
      where: { status: EMediaStatus.UNUSED },
    });

    // Removes all unused media from could storage
    await Promise.all(
      unusedMediaList.map((item) =>
        this.mediaService.delete({ where: { clientId: item.clientId } }),
      ),
    );
  }
}
