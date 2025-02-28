import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UpdatePermissionsDto } from '@zpanel/core';
import { groupBy, isString, omit, uniq } from 'lodash';

import { DatabaseService } from 'src/database';
import { Inspector } from 'utils';

// ----------

@Injectable()
export class PermissionsService {
  constructor(private readonly dbs: DatabaseService) {}

  findAllPermissions = async () => {
    return await this.dbs.permission.findMany({
      where: { deleted: false },
      include: { parent: { select: { clientId: true } } },
      orderBy: { pid: 'asc' },
    });
  };

  updatePermissions = async ({
    newPermissions,
    changedPermissions,
    deletedIds,
  }: UpdatePermissionsDto) => {
    const updatedCodes = changedPermissions.map((item) => item.code);
    const updatedIds = changedPermissions.map((item) => item.id);
    const newCodes = newPermissions.map((item) => item.code);
    const allCodes = updatedCodes.concat(...newCodes);

    // --- VALIDATE PERMISSIONS ---

    await new Inspector(allCodes.length === uniq(allCodes).length)
      .expect(true)
      .otherwise(() => {
        throw new BadRequestException('Duplicated permission code found!');
      });

    await new Inspector(
      this.dbs.permission.count({
        where: {
          code: { in: updatedCodes },
          clientId: { notIn: updatedIds.concat(...deletedIds) },
        },
      }),
    )
      .expect(0)
      .otherwise(() => {
        throw new BadRequestException('Duplicated permission code found!');
      });

    // --- UPDATE PERMISSIONS ---

    await this.dbs.$transaction(async () => {
      // Delete the permissions
      await this.deleteMany(deletedIds.map((clientId) => ({ clientId })));

      // Update the permissions
      await this.updateMany(
        changedPermissions.map(({ id, parentId, ...item }) => ({
          ...item,
          ...(parentId && { parent: { connect: { clientId: parentId } } }),
          clientId: id,
        })),
      );

      // Create the new parent permissions
      const newPermissionsGroups = groupBy(newPermissions, 'parentId');
      await this.createMany(
        newPermissionsGroups['null']?.map(({ id, ...item }) => ({
          ...item,
          children: {
            createMany: {
              data:
                (id &&
                  newPermissionsGroups[id]?.map((child) =>
                    omit(child, ['id', 'parentId']),
                  )) ||
                [],
            },
          },
        })),
      );

      // Create the new child permissions
      const newParentIds = newPermissionsGroups['null']
        ?.map(({ id }) => id)
        .filter(isString);
      const otherNewChildPermissions = Object.values(
        omit(newPermissionsGroups, [...(newParentIds ?? []), 'null']),
      ).flat();
      await this.createMany(
        otherNewChildPermissions.map((item) => ({
          ...omit(item, ['id', 'parentId']),
          parent: {
            connect: { clientId: item.parentId! },
          },
        })),
      );
    });
  };

  create = async (item: Prisma.PermissionCreateInput) => {
    return await this.dbs.permission.create({ data: item });
  };

  createMany = async (items: Prisma.PermissionCreateInput[] = []) => {
    return await Promise.all(items.map(this.create));
  };

  update = async (
    item: Prisma.PermissionWhereUniqueInput,
    data: Prisma.PermissionUpdateInput,
  ) => {
    return await this.dbs.permission.update({ where: item, data });
  };

  updateMany = async (
    items: (Pick<Prisma.PermissionWhereUniqueInput, 'pid' | 'clientId'> &
      Prisma.PermissionUpdateInput)[] = [],
  ) => {
    return await Promise.all(
      items.map((item) =>
        this.update({ pid: item.pid, clientId: item.clientId }, item),
      ),
    );
  };

  delete = async (item: Prisma.PermissionWhereUniqueInput) => {
    // Soft delete the item
    const deletedItem = await this.dbs.permission.update({
      data: { deleted: true },
      select: { pid: true, code: true },
      where: item,
    });

    // Update the code to reflect the deletion
    await this.dbs.permission.update({
      where: { pid: deletedItem.pid },
      data: { code: `!${deletedItem.pid} ${deletedItem.code}` },
    });
  };

  deleteMany = async (items: Prisma.PermissionWhereUniqueInput[] = []) => {
    return await Promise.all(items.map(this.delete));
  };
}
