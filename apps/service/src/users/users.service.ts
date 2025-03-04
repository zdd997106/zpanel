import { Injectable } from '@nestjs/common';
import { UpdateUserRoleDto } from '@zpanel/core';

import { DatabaseService } from 'src/database';
import { createValidationError, Inspector } from 'utils';

@Injectable()
export class UsersService {
  constructor(private readonly dbs: DatabaseService) {}

  public async findAllUsers() {
    return await this.dbs.user.findMany({
      include: { avatar: true, role: true },
      orderBy: { uid: 'asc' },
    });
  }

  public updateUserRole = async (
    id: string,
    updateUserRoleDto: UpdateUserRoleDto,
  ) => {
    const user = await new Inspector(
      this.dbs.user.findUnique({ where: { clientId: id } }),
    ).essential();

    const role = await new Inspector(
      this.dbs.role.findUnique({ where: { code: updateUserRoleDto.role } }),
    )
      .essential()
      .otherwise(() => createValidationError(['role'], 'Role not found'));

    await this.dbs.user.update({
      data: { roleId: role.rid },
      where: { uid: user.uid },
    });
  };
}
