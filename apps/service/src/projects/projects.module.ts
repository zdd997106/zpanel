import { Module } from '@nestjs/common';

import { PortfolioModule } from './portfolio/portfolio.module';

@Module({
  imports: [PortfolioModule],
})
export class ProjectsModule {}
