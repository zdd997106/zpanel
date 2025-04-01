import { Injectable } from '@nestjs/common';
import { CreateContactMeFormSubmissionDto, DataType } from '@zpanel/core';

import { Model } from 'modules/database';
import { safeJsonParse } from 'utils';

// ----------

@Injectable()
export class TransformerService {
  constructor() {}

  public toContactMeFormSubmissionDto(
    submission: Pick<
      Model.Submission,
      'meta' | 'clientId' | 'archived' | 'createdAt'
    >,
  ): DataType.ContractMeForm.SubmissionDto {
    return {
      id: submission.clientId,
      createdAt: submission.createdAt,
      archived: submission.archived,
      ...safeJsonParse<ContactMeSubmissionMetaDto>(
        submission.meta,
        null as never,
      ),
    };
  }

  public toContactMeFormSubmissionDetailDto(
    submission: Model.Submission,
  ): DataType.ContractMeForm.SubmissionDetailDto {
    return {
      id: submission.clientId,
      createdAt: submission.createdAt,
      ...safeJsonParse<ContactMeSubmissionMetaDto>(
        submission.meta,
        null as never,
      ),
      ...safeJsonParse<ContactMeSubmissionDataDto>(
        submission.data,
        null as never,
      ),
    };
  }
}

// ----- TYPES -----

type ContactMeSubmissionMetaDto = Pick<
  CreateContactMeFormSubmissionDto,
  'name' | 'email' | 'service'
>;

type ContactMeSubmissionDataDto = Omit<
  CreateContactMeFormSubmissionDto,
  keyof ContactMeSubmissionMetaDto
>;
