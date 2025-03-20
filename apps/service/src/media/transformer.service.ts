import { Injectable } from '@nestjs/common';
import { pick } from 'lodash';
import { DataType } from '@zpanel/core';

import { Model } from 'modules/database';

// ----------

@Injectable()
export class TransformerService {
  constructor() {}

  public toMediaDto = (media: Model.Media): DataType.MediaDto => {
    return {
      ...pick(media, ['name', 'size', 'mineTypes', 'createdAt', 'updatedAt']),
      id: media.clientId,
    };
  };
}
