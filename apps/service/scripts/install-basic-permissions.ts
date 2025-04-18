import { PrismaClient } from '@prisma/client';
import {
  EPermission,
  EPermissionAction,
  EPermissionStatus,
} from '@zpanel/core';

import './utils/sync-env';

const Action = EPermissionAction;

// ----------

class BasicPermissionInstaller {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  public async run() {
    try {
      await this.createPermissions();
    } finally {
      await this.prisma.$disconnect();
    }
  }

  // --- INTERNAL FUNCTIONS ---

  private async createPermissions() {
    const parents = [
      {
        code: EPermission.APP_OVERVIEW,
        name: 'App Overview',
        action: Action.READ,
        status: EPermissionStatus.ENABLED,
      },
      {
        code: EPermission.PROJECT_PORTFOLIO,
        name: 'Portfolio',
        action: Action.READ | Action.UPDATE,
        status: EPermissionStatus.ENABLED,
      },
      {
        code: EPermission.GENERAL,
        name: 'General',
        action: Action.READ,
        status: EPermissionStatus.ENABLED,
      },
      {
        code: EPermission.ADMINISTRATION,
        name: 'Administration',
        action: Action.READ,
        status: EPermissionStatus.ENABLED,
      },
    ];

    const children = [
      {
        parentCode: EPermission.ADMINISTRATION,
        code: EPermission.USER_CONFIGURE,
        name: 'User Configure',
        action: Action.CREATE | Action.READ | Action.UPDATE | Action.DELETE,
        status: EPermissionStatus.ENABLED,
      },
      {
        parentCode: EPermission.ADMINISTRATION,
        code: EPermission.APPLICATION_CONFIGURE,
        name: 'Application Configure',
        action: Action.READ | Action.UPDATE | Action.DELETE,
        status: EPermissionStatus.ENABLED,
      },
      {
        parentCode: EPermission.ADMINISTRATION,
        code: EPermission.PERMISSION_CONFIGURE,
        name: 'Permission Configure',
        action: Action.CREATE | Action.READ | Action.UPDATE | Action.DELETE,
        status: EPermissionStatus.ENABLED,
      },
      {
        parentCode: EPermission.ADMINISTRATION,
        code: EPermission.ROLE_CONFIGURE,
        name: 'Role Configure',
        action: Action.CREATE | Action.READ | Action.UPDATE | Action.DELETE,
        status: EPermissionStatus.ENABLED,
      },
      {
        parentCode: EPermission.ADMINISTRATION,
        code: EPermission.APP_KEY_CONFIGURE,
        name: 'App Key Configure',
        action: Action.CREATE | Action.READ | Action.UPDATE | Action.DELETE,
        status: EPermissionStatus.ENABLED,
      },
      {
        parentCode: EPermission.ADMINISTRATION,
        code: EPermission.NOTIFICATION_CONFIGURE,
        name: 'Notification Configure',
        action: Action.CREATE | Action.READ,
        status: EPermissionStatus.ENABLED,
      },
      {
        parentCode: EPermission.GENERAL,
        code: EPermission.FEEDBACK,
        name: 'Feedback',
        action: Action.UPDATE,
        status: EPermissionStatus.ENABLED,
      },
      {
        parentCode: EPermission.GENERAL,
        code: EPermission.CONTACT_ME_FORM,
        name: 'Contact Me Form',
        action: Action.CREATE | Action.READ | Action.UPDATE | Action.DELETE,
        status: EPermissionStatus.ENABLED,
      },
      {
        parentCode: EPermission.GENERAL,
        code: EPermission.ACCOUNT,
        name: 'Account Settings',
        action: Action.READ | Action.UPDATE,
        status: EPermissionStatus.ENABLED,
      },
      {
        parentCode: EPermission.GENERAL,
        code: EPermission.APP_KEY_MANAGEMENT,
        name: 'App Key Management',
        action: Action.CREATE | Action.READ | Action.UPDATE | Action.DELETE,
        status: EPermissionStatus.ENABLED,
      },
      {
        parentCode: EPermission.GENERAL,
        code: EPermission.NOTIFICATION,
        name: 'Notification',
        action: Action.READ | Action.UPDATE,
        status: EPermissionStatus.ENABLED,
      },
    ];

    await Promise.all(
      parents.map(async (config) => {
        const role = await this.prisma.permission.upsert({
          where: { code: config.code },
          update: config,
          create: config,
        });

        console.log('✅ Permission synced:', role.name);
      }),
    );

    await Promise.all(
      children.map(async ({ parentCode, ...config }) => {
        const role = await this.prisma.permission.upsert({
          where: { code: config.code },
          update: { ...config, parent: { connect: { code: parentCode } } },
          create: { ...config, parent: { connect: { code: parentCode } } },
        });

        console.log('✅ Permission synced:', role.name);
      }),
    );
  }
}

// ----- MAIN -----

const basicPermissionInstaller = new BasicPermissionInstaller();
basicPermissionInstaller.run().catch((error) => {
  console.error(error);
  process.exit(1);
});
