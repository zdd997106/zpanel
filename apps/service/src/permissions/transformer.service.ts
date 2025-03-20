import { pick } from 'lodash';
import { Injectable } from '@nestjs/common';
import { DataType } from '@zpanel/core';

import { Model } from 'modules/database';

// ----------

@Injectable()
export class TransformerService {
  constructor() {}

  public toPermissionDto = (
    permission: Model.Permission & {
      parent: Pick<Model.Permission, 'clientId'> | null;
    },
  ): DataType.PermissionDto => {
    return {
      ...pick(permission, ['code', 'name', 'status', 'action']),
      id: permission.clientId,
      parentId: permission.parent?.clientId || null,
    };
  };
}
