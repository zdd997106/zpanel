import { PrismaClient } from '@prisma/client';
import { ERole, ERoleStatus } from '@zpanel/core';

import './utils/sync-env';

// ----------

class BasicRolesInstaller {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  public async run() {
    try {
      await this.createRoles();
    } finally {
      await this.prisma.$disconnect();
    }
  }

  // --- INTERNAL FUNCTIONS ---

  private async createRoles() {
    const configs = [
      {
        code: ERole.ADMIN,
        name: 'Administrator',
        description: 'Administrator role',
        status: ERoleStatus.ENABLED,
      },
      {
        code: ERole.USER,
        name: 'User',
        description: 'User role with basic permissions',
        status: ERoleStatus.ENABLED,
      },
    ];

    await Promise.all(
      configs.map(async (config) => {
        const role = await this.prisma.role.upsert({
          where: { code: config.code },
          update: config,
          create: config,
        });

        console.log('Role synced:', role.name);
      }),
    );
  }
}

// ----- MAIN -----

const basicRolesInstaller = new BasicRolesInstaller();
basicRolesInstaller.run().catch((error) => {
  console.error(error);
  process.exit(1);
});
