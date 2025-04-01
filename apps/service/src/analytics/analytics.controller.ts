import { Controller, Delete, Patch, Post, Put } from '@nestjs/common';

import { AppKeyGuard } from 'modules/guards';

// ----------

@AppKeyGuard.Control()
@Controller('analytics')
export class AnalyticsController {
  constructor() {}

  // --- POST: RECORD START ---

  @Post('visit')
  async enter() {}

  // --- PUT: RE-ENTER ---

  @Put('visit')
  async reenter() {}

  // --- PATCH: RECORD UPDATE ---

  @Patch('visit')
  async update() {}

  // --- DELETE: RECORD END ---

  @Delete('visit')
  async leave() {}
}
