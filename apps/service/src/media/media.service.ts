import { Inject, Injectable } from '@nestjs/common';
import {
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';

import { Inspector } from 'utils';
import { DatabaseService, Model } from 'modules/database';

// ----------

@Injectable()
export class MediaService {
  private s3Service: S3Client;

  constructor(
    private readonly configService: ConfigService,
    private readonly databaseService: DatabaseService,
    @Inject(REQUEST) private readonly request: Request,
  ) {
    this.s3Service = new S3Client({
      region: this.configService.getOrThrow('AWS_S3_REGION'),
      credentials: {
        accessKeyId: this.configService.getOrThrow('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.getOrThrow('AWS_ACCESS_SECRET_KEY'),
      },
    });
  }

  public getMedia = async (id: string) => {
    return await new Inspector(
      this.databaseService.media.findUnique({
        where: { clientId: id },
      }),
    ).essential();
  };

  public generateMediaAccessUrl = async (
    key: string,
    { expiresIn = 60000 } = {},
  ) => {
    return await getSignedUrl(
      this.s3Service,
      new GetObjectCommand({
        Bucket: this.configService.getOrThrow('AWS_S3_BUCKET'),
        Key: key,
      }),
      { expiresIn: expiresIn / 1000 },
    );
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
    await this.postFileToCloud(file, media.clientId);
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
        this.postFileToCloud(files[i], media.clientId),
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
    await this.deleteFileFromCloud(media.clientId);
    return media;
  };

  public findName = (media: Model.Media, definedFilename?: string) => {
    if (!definedFilename) return media.name;

    if (definedFilename.includes('.')) return definedFilename;

    return [definedFilename, media.name.split('.').pop()]
      .filter(Boolean)
      .join('.');
  };

  private postFileToCloud = async (file: Express.Multer.File, key: string) => {
    return await this.s3Service.send(
      new PutObjectCommand({
        Bucket: this.configService.getOrThrow('AWS_S3_BUCKET'),
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );
  };

  private deleteFileFromCloud = async (key: string) => {
    return await this.s3Service.send(
      new DeleteObjectCommand({
        Bucket: this.configService.getOrThrow('AWS_S3_BUCKET'),
        Key: key,
      }),
    );
  };
}
