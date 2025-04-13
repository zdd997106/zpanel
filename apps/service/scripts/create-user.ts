import { PrismaClient } from '@prisma/client';
import { ERole, EUserStatus } from '@zpanel/core';
import * as prompts from 'prompts';
import { isString } from 'lodash';

import { encodePassword } from '../utils/encode-password';
import './utils/sync-env';

// ----------

class UserCreator {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  public async run() {
    try {
      const name = await this.getName();
      const account = await this.getAccount(this.getDefaultAccount(name));
      const password = await this.getPassword();

      await this.createUser({ account, name, password });
    } finally {
      await this.prisma.$disconnect();
    }
  }

  // --- INTERNAL FUNCTIONS ---

  private async createUser(config: {
    account: string;
    name: string;
    password: string;
  }) {
    const role = await this.getRole();

    if (!role) {
      throw new Error(
        'Unable to find role from the database. Please run the prepare-basic-roles script to make sure the roles are created.',
      );
    }

    const data = {
      account: config.account,
      name: config.name,
      password: encodePassword(config.password, 0), // Placeholder, will be updated later
      role: { connect: { rid: role.rid } },
      status: EUserStatus.ACTIVE,
    };

    const user = await this.prisma.user.upsert({
      where: { account: config.account },
      create: data,
      update: data,
    });

    await this.prisma.user.update({
      where: { uid: user.uid },
      data: { password: encodePassword(config.password, user.uid) },
    });

    console.log('User created:', {
      ...user,
      password: '**********',
    });
  }

  // --- INTERNAL FUNCTIONS: PROMPTS ---

  private async getName(): Promise<string> {
    const input = await prompts({
      type: 'text',
      name: 'name',
      message: 'Enter the name for the user:\n',
    });

    if (!isString(input.name)) throw new Error();
    if (!input.name) return this.getName();

    return input.name;
  }

  private async getAccount(defaultAccount: string): Promise<string> {
    const { account } = await prompts({
      type: 'text',
      name: 'account',
      message: `Enter the account for the user: (default: ${defaultAccount})\n`,
    });

    if (!isString(account)) throw new Error();

    return account || defaultAccount;
  }

  private async getPassword() {
    const { password } = await prompts({
      type: 'password',
      name: 'password',
      message: `Enter the password for the user: (default: ${this.getDefaultPassword()})\n`,
    });

    if (!isString(password)) throw new Error();

    return password || this.getDefaultPassword();
  }

  private async getRole() {
    const { roleCode } = await prompts({
      type: 'select',
      name: 'roleCode',
      message: 'Choose the role for the user:\n',
      choices: Object.keys(ERole).map((role) => ({
        title: role,
        value: ERole[role],
      })),
    });

    if (!isString(roleCode)) throw new Error();

    const role = await this.prisma.role.findUnique({
      where: { code: roleCode },
    });

    return role;
  }

  // --- INTERNAL FUNCTIONS: DEFAULT VALUES ---

  private getDefaultAccount(name: string) {
    return `${name.toLocaleLowerCase().replace(/\s+/g, '.')}`;
  }

  private getDefaultPassword() {
    return 'P@s$w0rd';
  }
}

// ----- MAIN -----

const adminUserCreator = new UserCreator();
adminUserCreator.run().catch((error) => {
  if (!(error instanceof Error)) return;
  if (!error.message) return; // Cancelled by user

  console.error(error);
  process.exit(1);
});
