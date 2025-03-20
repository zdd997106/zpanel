import { Module } from '@nestjs/common';

import { DatabaseModule } from 'modules/database';

import { PortfolioService } from './portfolio.service';
import { TransformerService } from './transformer.service';
import { PortfolioController } from './portfolio.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [PortfolioController],
  providers: [PortfolioService, TransformerService],
})
export class PortfolioModule {}
