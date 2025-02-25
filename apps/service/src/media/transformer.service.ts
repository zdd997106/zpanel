import { Injectable } from '@nestjs/common';
import { pick } from 'lodash';
import { DataType } from '@zpanel/core';

import { Model } from 'src/database';
import { MediaService } from './media.service';

// ----------

@Injectable()
export class TransformerService {
  constructor(private readonly mediaService: MediaService) {}

  public toNoUrlMediaFile = (media: Model.Media): DataType.NoUrlMediaFile => {
    return {
      ...pick(media, ['name', 'size', 'mineTypes', 'createdAt', 'updatedAt']),
      id: media.clientId,
    };
  };

  public toMediaFile = (media: Model.Media): DataType.MediaFile => {
    return {
      ...this.toNoUrlMediaFile(media),
      url: this.mediaService.getMediaUrl(media),
    };
  };
}
