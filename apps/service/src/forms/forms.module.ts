import { Module } from '@nestjs/common';

import { ContactMeFormModule } from './contact-me';

@Module({
  imports: [ContactMeFormModule],
})
export class FormsModule {}
