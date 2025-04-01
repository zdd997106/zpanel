import { Injectable } from '@nestjs/common';
import {
  CreateContactMeFormSubmissionDto,
  DataType,
  EFormType,
  FindContactMeFormSubmissionsDto,
  UpdateContactMeFormSubmissionDto,
} from '@zpanel/core';
import { escapeRegExp, pick } from 'lodash';

import { Inspector } from 'utils';
import { DatabaseService } from 'modules/database';

import { TransformerService } from './transformer.service';

// ----------

@Injectable()
export class ContactMeFormService {
  constructor(
    private readonly dbs: DatabaseService,
    private readonly transformerService: TransformerService,
  ) {}

  public async findContactMeFormSubmissions(
    findContactMeFormSubmissionsDto: FindContactMeFormSubmissionsDto,
  ) {
    const { page, limit, ...filters } = findContactMeFormSubmissionsDto;

    const records = await this.dbs.submission.findMany({
      select: { clientId: true, meta: true, createdAt: true, archived: true },
      where: { type: EFormType.CONTACT_ME, archived: filters.archived },
    });

    const submissions: DataType.ContractMeForm.SubmissionDto[] = records.map(
      this.transformerService.toContactMeFormSubmissionDto,
    );

    const matchSubmissions = submissions.filter((submission) => {
      if (filters.name && !like(submission.name, filters.name)) return false;

      if (filters.email && !like(submission.email, filters.email)) return false;

      if (
        filters.service &&
        (!submission.service || !like(submission.service, filters.service))
      )
        return false;

      return true;
    });

    const pagedSubmissions = matchSubmissions.slice(
      (page - 1) * limit,
      page * limit,
    );

    return { items: pagedSubmissions, count: matchSubmissions.length };
  }

  public async getContactMeFormSubmission(id: string) {
    const submission = await new Inspector(
      this.dbs.submission.findUnique({
        where: { clientId: id },
      }),
    ).essential();

    return await this.transformerService.toContactMeFormSubmissionDetailDto(
      submission,
    );
  }

  public async createContactMeFormSubmission(
    createContactMeFormSubmissionDto: CreateContactMeFormSubmissionDto,
  ) {
    await this.dbs.submission.create({
      data: {
        type: EFormType.CONTACT_ME,
        meta: JSON.stringify(
          pick(createContactMeFormSubmissionDto, ['name', 'email', 'service']),
        ),
        data: JSON.stringify(
          pick(createContactMeFormSubmissionDto, ['budget', 'description']),
        ),
      },
    });
  }

  public async archiveContactMeFormSubmission(id: string) {
    const submission = await new Inspector(
      this.dbs.submission.findUnique({
        select: { sid: true },
        where: { clientId: id },
      }),
    ).essential();

    return this.dbs.submission.update({
      where: { sid: submission.sid },
      data: { archived: true },
    });
  }

  public async updateContactMeFormSubmission(
    id: string,
    updateContactMeFormSubmissionDto: UpdateContactMeFormSubmissionDto,
  ) {
    const submission = await new Inspector(
      this.dbs.submission.findUnique({
        select: { sid: true },
        where: { clientId: id },
      }),
    ).essential();

    return this.dbs.submission.update({
      where: { sid: submission.sid },
      data: { archived: updateContactMeFormSubmissionDto.archived },
    });
  }

  public async deleteContactMeFormSubmission(id: string) {
    const submission = await new Inspector(
      this.dbs.submission.findUnique({
        select: { sid: true },
        where: { clientId: id },
      }),
    ).essential();

    return this.dbs.submission.delete({
      where: { sid: submission.sid },
    });
  }
}

// ----- HELPERS -----

function like(source: string, pattern: string) {
  return new RegExp(escapeRegExp(pattern), 'i').test(source);
}
