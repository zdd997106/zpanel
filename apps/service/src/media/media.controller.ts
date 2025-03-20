import {
  Controller,
  Get,
  HttpStatus,
  Next,
  Param,
  ParseFilePipeBuilder,
  Post,
  Query,
  Req,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { NextFunction, Request, Response } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { SkipThrottle } from '@nestjs/throttler';
import { GetMediaDto } from '@zpanel/core';

import { AuthGuard } from 'modules/guards';

import { MediaService } from './media.service';
import { TransformerService } from './transformer.service';

// ----- SETTINGS -----

const MAX_PROFILE_PICTURE_SIZE_IN_BYTES = 10 * 1024 * 1024; // 10 MB

const MEDIA_MAX_AGE = 60 * 60 * 1000; // an hour

// ----------

@Controller('media')
export class MediaController {
  private readonly s3Proxy: ReturnType<typeof createProxyMiddleware>;

  constructor(
    private readonly mediaService: MediaService,
    private readonly transformerService: TransformerService,
  ) {
    this.s3Proxy = createProxyMiddleware({
      router: async (req: Request<{ id: string }>) =>
        this.mediaService.generateMediaAccessUrl(req.params.id, {
          expiresIn: MEDIA_MAX_AGE,
        }),
      ignorePath: true,
      changeOrigin: true,
    });
  }

  // --- GET: READ RESOURCE ---

  @SkipThrottle()
  @Get(':id')
  async readFile(
    @Req() req: Request<unknown, unknown, unknown, GetMediaDto>,
    @Res() res: Response,
    @Next() next: NextFunction,
    @Param('id') id: string,
    @Query() query: GetMediaDto,
  ) {
    const media = await this.mediaService.getMedia(id);

    if (query.cache !== 'false') {
      res.setHeader('Cache-Control', `public, max-age=${MEDIA_MAX_AGE / 1000}`);
    }

    res.setHeader('Content-Type', media.mineTypes);

    const filename = this.mediaService.findName(media, query.filename);
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);

    void this.s3Proxy(req, res, next);
  }

  // --- POST: CREATE IMAGE RESOURCE ---

  @AuthGuard.Protect()
  @Post('images')
  @UseInterceptors(FilesInterceptor('files'))
  async updateImage(
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({ maxSize: MAX_PROFILE_PICTURE_SIZE_IN_BYTES })
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
    )
    files: Express.Multer.File[],
  ) {
    const mediaList = await this.mediaService.createMany(files);
    return mediaList.map(this.transformerService.toMediaDto);
  }
}
