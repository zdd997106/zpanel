import { Injectable } from '@nestjs/common';
import { DataType } from '@zpanel/core';

import { Model } from 'src/database';

// ----------

@Injectable()
export class TransformerService {
  constructor() {}

  public toApplicationDto = (
    application: Model.Application & {
      reviewer: null | Pick<Model.User, 'name' | 'clientId'>;
    },
  ): DataType.ApplicationDto => {
    return {
      id: application.clientId,
      email: application.email,
      name: application.name,
      introduction: application.introduction,
      status: application.status,
      reviewer: application.reviewer
        ? {
            id: application.reviewer.clientId,
            name: application.reviewer.name,
          }
        : null,
      createdAt: application.createdAt,
      updatedAt: application.updatedAt,
    };
  };
}
