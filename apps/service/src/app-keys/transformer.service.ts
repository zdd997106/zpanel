import { pick } from 'lodash';
import { Injectable } from '@nestjs/common';
import { DataType, EAppKeyStatus } from '@zpanel/core';

import { Model } from 'src/database';
import { UserTransformerService } from 'src/users';

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
        'updatedAt',
        'createdAt',
        'expiresAt',
        'lastModifier',
      ]),
      id: appKey.clientId,
      owner: this.user.toUserPreviewDto(appKey.owner),
      status: this.getStatus(appKey),
      lastModifier:
        appKey.lastModifier && this.user.toUserPreviewDto(appKey.lastModifier),
      lastAccessedAt: appKey.logs[0]?.createdAt || '',
    };
  };

  public toAppKeyDetailDto = (
    appKey: Model.AppKey,
  ): DataType.AppKeyDetailDto => {
    return {
      ...pick(appKey, ['name', 'key', 'updatedAt', 'createdAt', 'expiresAt']),
      id: appKey.clientId,
      status: this.getStatus(appKey),
      allowPaths: safeJsonParse(appKey.allowPaths, []),
    };
  };

  private getStatus = (appKey: Model.AppKey) => {
    const expired = !!appKey.expiresAt && appKey.expiresAt < new Date();
    return expired ? EAppKeyStatus.EXPIRED : appKey.status;
  };
}

function safeJsonParse<T>(json: string, defaultValue: T = {} as T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return defaultValue;
  }
}
