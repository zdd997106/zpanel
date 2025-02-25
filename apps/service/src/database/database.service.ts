import { PrismaClient } from '@prisma/client';
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit {
  public onModuleInit = async () => {
    await this.$connect();
  };

  public getTransactionMethod = () => {
    return this.$transaction.bind(this) as typeof this.$transaction;
  };
}
