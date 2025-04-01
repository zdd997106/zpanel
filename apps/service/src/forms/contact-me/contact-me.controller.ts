import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  CreateContactMeFormSubmissionDto,
  EPermission,
  FindContactMeFormSubmissionsDto,
  UpdateContactMeFormSubmissionDto,
} from '@zpanel/core';

import { AppKeyGuard, PermissionGuard } from 'modules/guards';

import { ContactMeFormService } from './contact-me.service';

// ----------

@AppKeyGuard.Control()
@Controller('forms/contact-me')
export class ContactMeFormController {
  constructor(private readonly contactMeFormService: ContactMeFormService) {}

  // --- GET: ALL SUBMISSIONS OF CONTACT ME FORM ---

  @Get('submissions')
  @PermissionGuard.CanRead(EPermission.CONTACT_ME_FORM)
  public async getContactMeFormSubmissions(
    @Query() findContactMeFormSubmissionsDto: FindContactMeFormSubmissionsDto,
  ) {
    return await this.contactMeFormService.findContactMeFormSubmissions(
      findContactMeFormSubmissionsDto,
    );
  }

  // --- GET: DETAILS OF CONTACT ME FORM SUBMISSION ---

  @Get('submissions/:id')
  @PermissionGuard.CanRead(EPermission.CONTACT_ME_FORM)
  public async getContactMeFormSubmission(@Param('id') id: string) {
    return await this.contactMeFormService.getContactMeFormSubmission(id);
  }

  // --- POST: CREATE CONTACT ME FORM SUBMISSION ---

  @Post('submissions')
  @PermissionGuard.CanCreate(EPermission.CONTACT_ME_FORM)
  public async createContactMeFormSubmission(
    @Body() createContactMeFormSubmissionDto: CreateContactMeFormSubmissionDto,
  ) {
    await this.contactMeFormService.createContactMeFormSubmission(
      createContactMeFormSubmissionDto,
    );
  }

  // --- PATCH: ARCHIVE/UNARCHIVE CONTACT ME FORM SUBMISSION ---

  @Patch('submissions/:id')
  @PermissionGuard.CanUpdate(EPermission.CONTACT_ME_FORM)
  public async updateContactMeFormSubmission(
    @Param('id') id: string,
    @Body() updateContactMeFormSubmissionDto: UpdateContactMeFormSubmissionDto,
  ) {
    await this.contactMeFormService.updateContactMeFormSubmission(id, {
      ...updateContactMeFormSubmissionDto,
    });
  }

  // --- DELETE: DELETE CONTACT ME FORM SUBMISSION ---
  @Delete('submissions/:id')
  @PermissionGuard.CanDelete(EPermission.CONTACT_ME_FORM)
  public async deleteContactMeFormSubmission(@Param('id') id: string) {
    await this.contactMeFormService.deleteContactMeFormSubmission(id);
  }
}
