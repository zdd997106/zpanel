import { PrismaClient } from '@prisma/client';
import './utils/sync-env';

class UserMigrator {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  public async run() {
    try {
      await this.procedure();
    } finally {
      await this.prisma.$disconnect();
    }
  }

  private async procedure() {
    const users = await this.findAllUsers();
    await this.prisma.$transaction(async () => {
      await Promise.all(
        users.map(async (user) => {
          const account = user.email?.split('@')[0] ?? '';
          await this.prisma.user.update({
            data: { account },
            where: { uid: user.uid },
          });
          console.log(
            `✅ ${user.name} (${user.email}) updated with account: ${account}`,
          );
        }),
      );
    });
  }

  private async findAllUsers() {
    return this.prisma.user.findMany({});
  }
}

// ----- MAIN -----

const migrator = new UserMigrator();
migrator.run().catch((error) => {
  if (!(error instanceof Error)) return;
  if (!error.message) return; // Cancelled by user

  console.error(error);
  process.exit(1);
});
