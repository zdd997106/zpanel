import { pick } from 'lodash';
import { Injectable } from '@nestjs/common';
import { DataType } from '@zpanel/core';

import { Model } from 'src/database';
import { TransformerService as UserTransformerService } from 'src/users/transformer.service';

// ----------

@Injectable()
export class TransformerService {
  constructor(private readonly user: UserTransformerService) {}

  public toAppKeyDto = (
    appKey: Model.AppKey & {
      owner: Model.User;
      lastModifier: Model.User | null;
      logs: Model.AppLog[];
    },
  ): DataType.AppKeyDto => {
    return {
      ...pick(appKey, [
        'name',
        'key',
        'status',
        'updatedAt',
        'createdAt',
        'lastModifier',
      ]),
      id: appKey.clientId,
      owner: this.user.toUserPreviewDto(appKey.owner),
      lastModifier:
        appKey.lastModifier && this.user.toUserPreviewDto(appKey.lastModifier),
      lastAccessedAt: appKey.logs[0]?.createdAt || '',
    };
  };

  public toAppKeyDetailDto = (
    appKey: Model.AppKey,
  ): DataType.AppKeyDetailDto => {
    return {
      ...pick(appKey, [
        'name',
        'key',
        'status',
        'updatedAt',
        'createdAt',
        'expiresAt',
      ]),
      id: appKey.clientId,
      origins: safeJsonParse(appKey.origins, []),
      allowPaths: safeJsonParse(appKey.allowPaths, []),
    };
  };
}

function safeJsonParse<T>(json: string, defaultValue: T = {} as T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return defaultValue;
  }
}
