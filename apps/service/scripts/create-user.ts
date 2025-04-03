import { PrismaClient } from '@prisma/client';
import { ERole } from '@zpanel/core';
import * as prompts from 'prompts';
import { isString } from 'lodash';
import { z } from 'zod';

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
      const email = await this.getEmail(this.getDefaultEmail(name));
      const password = await this.getPassword();

      await this.createUser({ email, name, password });
    } finally {
      await this.prisma.$disconnect();
    }
  }

  // --- INTERNAL FUNCTIONS ---

  private async createUser(config: {
    email: string;
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
      email: config.email,
      name: config.name,
      password: encodePassword(config.password, 0), // Placeholder, will be updated later
      role: { connect: { rid: role.rid } },
    };

    const user = await this.prisma.user.upsert({
      where: { email: config.email },
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

  private async getEmail(defaultEmail: string): Promise<string> {
    const { email } = await prompts({
      type: 'text',
      name: 'email',
      message: `Enter the email for the user: (default: ${defaultEmail})\n`,
    });

    if (!isString(email)) throw new Error();

    return email
      ? z
          .string()
          .email()
          .parseAsync(email)
          .catch(() => this.getEmail(defaultEmail))
      : defaultEmail;
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

  private getDefaultEmail(name: string) {
    return `${name.toLocaleLowerCase().replace(/\s+/g, '.')}@zdd997.com`;
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
