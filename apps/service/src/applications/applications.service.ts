import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { includes } from 'lodash';
import {
  EApplicationStatus,
  ApproveApplicationDto,
  RejectApplicationDto,
} from '@zpanel/core';
import { Prisma } from '@prisma/client';
import { REQUEST } from '@nestjs/core';

import {
  createValidationError,
  encodePassword,
  generatePassword,
  Inspector,
} from 'utils';
import { DatabaseService } from 'modules/database';
import { MailService } from 'modules/mail';

@Injectable()
export class ApplicationsService {
  constructor(
    private readonly dbs: DatabaseService,
    private readonly mailService: MailService,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  public async findAllApplication() {
    return await this.dbs.application.findMany({ include: { reviewer: true } });
  }

  public async approveApplication(
    id: string,
    approveApplicationDto: ApproveApplicationDto,
  ) {
    const application = await this.getApplication({ clientId: id });

    const createdUser = await this.dbs.$transaction(async () => {
      const userId = this.request.signedInInfo.userId;
      await this.dbs.application.update({
        data: {
          status: EApplicationStatus.APPROVED,
          reviewer: { connect: { clientId: userId } },
        },
        where: { aid: application.aid },
      });

      // Skip creating process if the user already exists
      if (
        await this.dbs.user.findFirst({ where: { email: application.email } })
      )
        return;

      const role = await new Inspector(
        this.dbs.role.findUnique({
          where: { code: approveApplicationDto.role, deleted: false },
        }),
      )
        .essential()
        .otherwise(() => createValidationError(['role'], 'Role not found'));

      const temporaryPassword = generatePassword(32);
      const createdUser = await this.dbs.user.create({
        select: { uid: true, name: true, email: true },
        data: {
          email: application.email,
          name: application.name,
          password: encodePassword(temporaryPassword, 0),
          roleId: role.rid,
        },
      });

      await this.dbs.user.update({
        data: { password: encodePassword(temporaryPassword, createdUser.uid) },
        where: { uid: createdUser.uid },
      });

      return { ...createdUser, password: temporaryPassword };
    });

    if (!createdUser) return;
    await this.mailService.sendApplicationApproval(createdUser.email, {
      name: createdUser.name,
      password: createdUser.password,
    });
  }

  public async rejectApplication(
    id: string,
    rejectApplicationDto: RejectApplicationDto,
  ) {
    const application = await this.getApplication({ clientId: id });

    await this.dbs.application.update({
      data: {
        status: EApplicationStatus.REJECTED,
        rejectReason: rejectApplicationDto.reason,
      },
      where: { aid: application.aid },
    });

    await this.mailService.sendApplicationRejection(application.email, {
      name: application.name,
      reason: rejectApplicationDto.reason,
    });
  }

  public async deleteApplication(id: string) {
    const application = await this.getApplication({ clientId: id });

    await new Inspector(
      includes(
        [EApplicationStatus.APPROVED, EApplicationStatus.REJECTED],
        application.status,
      ),
    )
      .expect(true)
      .otherwise(() => {
        throw new BadRequestException(
          'Cannot delete an application that has not been reviewed yet',
        );
      });

    await this.dbs.application.delete({
      where: { aid: application.aid },
    });
  }

  private async getApplication(
    applicationWhereUniqueInput: Prisma.ApplicationWhereUniqueInput,
  ) {
    return await new Inspector(
      this.dbs.application.findUnique({
        where: applicationWhereUniqueInput,
      }),
    ).essential();
  }
}
