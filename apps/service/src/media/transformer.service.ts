import { Injectable } from '@nestjs/common';
import { pick } from 'lodash';
import { DataType } from '@zpanel/core';

import { Model } from 'src/database';
import { MediaService } from './media.service';

// ----------

@Injectable()
export class TransformerService {
  constructor(private readonly mediaService: MediaService) {}

  public toMediaDto = (media: Model.Media): DataType.MediaDto => {
    return {
      ...pick(media, ['name', 'size', 'mineTypes', 'createdAt', 'updatedAt']),
      id: media.clientId,
    };
  };

  public toAccessibleMediaDto = (
    media: Model.Media,
  ): DataType.AccessibleMediaDto => {
    return {
      ...this.toMediaDto(media),
      url: this.mediaService.getMediaUrl(media),
    };
  };
}
