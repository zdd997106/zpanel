import { Body, Controller, Get, Put } from '@nestjs/common';
import { UpdatePortfolioDto, EPermission } from '@zpanel/core';

import { TransformerService } from './transformer.service';
import { PortfolioService } from './portfolio.service';
import { PermissionGuard } from 'src/permissions';
import { AppKeyGuard } from 'src/app-keys';

// ----------

@AppKeyGuard.Control()
@Controller('projects/portfolio')
export class PortfolioController {
  constructor(
    private readonly portfolioService: PortfolioService,
    private readonly transformerService: TransformerService,
  ) {}

  // --- GET: PORTFOLIO DETAIL ---

  @PermissionGuard.CanRead(EPermission.PORTFOLIO)
  @Get()
  async getPortfolioDetail() {
    const object = await this.portfolioService.getPortfolioObject();
    return await this.transformerService.toPortfolioDto(object);
  }

  // --- PUT: UPDATE PORTFOLIO ---

  @PermissionGuard.CanUpdate(EPermission.PORTFOLIO)
  @Put()
  async updatePortfolio(@Body() updatePortfolioDto: UpdatePortfolioDto) {
    await this.portfolioService.updatePortfolio(updatePortfolioDto);
  }
}
