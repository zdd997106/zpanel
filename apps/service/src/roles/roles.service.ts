import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateRoleDto, ERole, RolePermissionDto } from '@zpanel/core';

import { createValidationError, Inspector } from 'utils';
import { DatabaseService } from 'src/database';

// ----------

@Injectable()
export class RolesService {
  constructor(private readonly dbs: DatabaseService) {}

  public findAllRoles = async () => {
    return await this.dbs.role.findMany({
      include: { _count: { select: { users: true } } },
      where: { deleted: false },
      orderBy: { rid: 'asc' },
    });
  };

  public getRole = async (id: string) => {
    return await new Inspector(
      this.dbs.role.findUnique({
        include: {
          permissions: {
            select: {
              action: true,
              permission: { select: { clientId: true } },
            },
          },
        },
        where: { deleted: false, clientId: id },
      }),
    ).essential();
  };

  public createRole = async ({
    rolePermissions,
    ...roleDto
  }: CreateRoleDto) => {
    await new Inspector(
      this.dbs.role.findFirst({ where: { code: roleDto.code } }),
    )
      .expect(null)
      .otherwise(() =>
        createValidationError(['code'], 'Role code already exists'),
      );

    await this.dbs.$transaction(async () => {
      const role = await this.dbs.role.create({ data: roleDto });
      await this.updateRolePermissions({ rid: role.rid }, rolePermissions);
    });
  };

  public updateRole = async (
    id,
    { rolePermissions, ...roleDto }: CreateRoleDto,
  ) => {
    await new Inspector(
      this.dbs.role.findFirst({
        where: { code: roleDto.code, clientId: { not: id } },
      }),
    )
      .expect(null)
      .otherwise(() =>
        createValidationError(['code'], 'Role code already exists'),
      );

    await this.dbs.$transaction(async () => {
      await this.dbs.role.update({
        data: { ...roleDto },
        where: { clientId: id },
      });
      await this.updateRolePermissions({ clientId: id }, rolePermissions);
    });
  };

  public deleteRole = async (id) => {
    const guestRole = await this.getGuestRole();

    const role = await new Inspector(
      this.dbs.role.findUnique({ where: { clientId: id } }),
    ).essential();

    await this.dbs.$transaction(async () => {
      await this.dbs.role.update({
        data: { deleted: true, code: `!${role.rid} ${role.code}` },
        where: { rid: role.rid },
      });

      await this.dbs.user.updateMany({
        where: { role: { clientId: id } },
        data: { roleId: guestRole.rid },
      });
    });
  };

  getRoleOptions = async () => {
    return await this.dbs.role.findMany({
      select: { name: true, code: true },
      where: { deleted: false },
      orderBy: { rid: 'asc' },
    });
  };

  // --- PRIVATE ---

  private getGuestRole = async () => {
    return await new Inspector(
      this.dbs.role.findFirst({ where: { code: ERole.GUEST } }),
    )
      .essential()
      .otherwise(() => new Error('Guest role is not installed'));
  };

  private updateRolePermissions = async (
    roleWhereUniqueInput: Prisma.RoleWhereUniqueInput,
    rolePermissions: RolePermissionDto[],
  ) => {
    const role = await new Inspector(
      this.dbs.role.findUnique({
        select: { rid: true },
        where: roleWhereUniqueInput,
      }),
    ).essential();

    const permissions = await this.dbs.permission.findMany({
      select: { pid: true, clientId: true },
      where: { clientId: { in: rolePermissions.map((item) => item.id) } },
    });

    const permissionMap = Object.fromEntries(
      permissions.map((item) => [item.clientId, item]),
    );

    // Delete all permissions that no available actions
    await this.dbs.rolePermission.deleteMany({
      where: {
        roleId: role.rid,
        permissionId: {
          in: rolePermissions
            .filter((rolePermission) => rolePermission.action === 0)
            .map((rolePermission) => permissionMap[rolePermission.id].pid),
        },
      },
    });

    await Promise.all(
      rolePermissions
        .filter((rolePermission) => rolePermission.action !== 0)
        .map(async (rolePermission) =>
          this.dbs.rolePermission.upsert({
            update: { action: rolePermission.action },

            create: {
              action: rolePermission.action,
              roleId: role.rid,
              permissionId: permissionMap[rolePermission.id].pid,
            },

            where: {
              roleId_permissionId: {
                roleId: role.rid,
                permissionId: permissionMap[rolePermission.id].pid,
              },
            },
          }),
        ),
    );
  };
}
