import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';

import { Inspector } from 'utils';
import { DatabaseService, Model } from 'modules/database';

import { S3Service } from './s3.service';

// ----------

@Injectable()
export class MediaService {
  constructor(
    private readonly configService: ConfigService,
    private readonly databaseService: DatabaseService,
    private readonly s3Service: S3Service,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  public getMedia = async (id: string) => {
    return await new Inspector(
      this.databaseService.media.findUnique({
        where: { clientId: id },
      }),
    ).essential();
  };

  public generateMediaAccessUrl = async (
    key: string,
    { expiresIn = 60 } = {},
  ) => {
    return await this.s3Service.getSignedUrl(key, { expiresIn });
  };

  public getMediaUrl = (media: Model.Media) => {
    return `${this.configService.getOrThrow('API_BASE_URL')}/media/${media.clientId}`;
  };

  public create = async (
    file: Express.Multer.File,
    meta: Pick<Model.Media, 'uploaderId'>,
  ) => {
    const media = await this.databaseService.media.create({
      data: {
        ...meta,
        mineTypes: file.mimetype,
        name: file.originalname,
        size: file.size,
      },
    });

    // Post file to cloud storage (s3)
    await this.s3Service.create(file, media.clientId);
    return media;
  };

  public createMany = async (files: Express.Multer.File[]) => {
    const mediaList = await this.databaseService.$transaction(
      files.map((file) =>
        this.databaseService.media.create({
          data: {
            mineTypes: file.mimetype,
            name: file.originalname,
            size: file.size,
            uploader: {
              connect: { clientId: this.request.signedInInfo.userId },
            },
          },
        }),
      ),
    );

    await Promise.all(
      mediaList.map((media, i) =>
        this.s3Service.create(files[i], media.clientId),
      ),
    );

    // Post file to cloud storage (s3)
    return mediaList;
  };

  public delete = async (
    args: Parameters<typeof this.databaseService.media.delete>[0],
  ) => {
    const media = await this.databaseService.media.delete(args);

    // Delete file from cloud storage (s3)
    await this.s3Service.delete(media.clientId);
    return media;
  };

  public findName = (media: Model.Media, definedFilename?: string) => {
    if (!definedFilename) return media.name;

    if (definedFilename.includes('.')) return definedFilename;

    return [definedFilename, media.name.split('.').pop()]
      .filter(Boolean)
      .join('.');
  };
}
