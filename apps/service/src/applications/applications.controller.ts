import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApproveApplicationDto, RejectApplicationDto } from '@zpanel/core';

import { AuthGuard } from 'src/guards';

import { ApplicationsService } from './applications.service';
import { TransformerService } from './transformer.service';

@Controller('applications')
export class ApplicationsController {
  constructor(
    private readonly applicationsService: ApplicationsService,
    private readonly transformerService: TransformerService,
  ) {}

  @AuthGuard.Protect()
  @Get()
  async findAllApplications() {
    const applications = await this.applicationsService.findAllApplication();
    return applications.map(this.transformerService.toApplicationDto);
  }

  @AuthGuard.Protect()
  @Post(':id/approve')
  approveApplication(
    @Param('id') id: string,
    @Body() approveApplicationDto: ApproveApplicationDto,
  ) {
    return this.applicationsService.approveApplication(
      id,
      approveApplicationDto,
    );
  }

  @AuthGuard.Protect()
  @Post(':id/reject')
  rejectApplication(
    @Param('id') id: string,
    @Body() rejectApplicationDto: RejectApplicationDto,
  ) {
    return this.applicationsService.rejectApplication(id, rejectApplicationDto);
  }

  @AuthGuard.Protect()
  @Delete(':id')
  deleteApplication(@Param('id') id: string) {
    return this.applicationsService.deleteApplication(id);
  }
}
