import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { ERole, UpdateUserRoleDto } from '@zpanel/core';
import { Request } from 'express';

import { DatabaseService } from 'src/database';
import { createValidationError, Inspector } from 'utils';

@Injectable()
export class UsersService {
  constructor(
    private readonly dbs: DatabaseService,
    @Inject(REQUEST) private readonly req: Request,
  ) {}

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

  public verifyAccess = async (userId: string) => {
    const user = await new Inspector(
      this.dbs.user.findUnique({
        select: { clientId: true, role: { select: { code: true } } },
        where: { clientId: userId },
      }),
    ).essential();

    // Allow access for admin
    if (user.role.code === ERole.ADMIN) return;

    // Otherwise: Only allow access for the user themselves
    await new Inspector(user.clientId === this.req.signedInInfo.userId)
      .expect(true)
      .otherwise(() => {
        throw new ForbiddenException();
      });
  };
}
