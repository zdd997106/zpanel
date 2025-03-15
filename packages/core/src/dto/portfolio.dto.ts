import { createZodDto } from 'nestjs-zod/dto';

import { z } from 'src/schema';

// ----- UPDATE PORTFOLIO: OPENING -----

export class UpdatePortfolioSectionDto extends createZodDto(
  z.object({
    title: z.string().nonempty('Required').max(64).trim(),
    subtitle: z.string().nonempty('Required').max(255).trim(),
  }),
) {}

// ----- UPDATE PORTFOLIO: SELECTION -----

export class UpdatePortfolioOpeningDto extends createZodDto(
  UpdatePortfolioSectionDto.schema.and(
    z.object({
      avatar: z.entities.media(),
      cv: z.entities.media(),
    }),
  ),
) {}

// ----- UPDATE PORTFOLIO: SELECTION -----

export class UpdatePortfolioSelectionDto extends createZodDto(
  UpdatePortfolioSectionDto.schema.and(
    z.object({
      items: z.array(
        z.object({
          title: z.string().nonempty('Required').max(64).trim(),
          role: z.string().nonempty('Required').max(64).trim(),
          description: z.string().nonempty('Required').max(1024).trim(),
          img: z.entities.media(),
          link: z
            .object({
              website: z.string().max(255).trim().optional(),
              github: z.string().max(255).trim().optional(),
            })
            .optional(),
        }),
      ),
    }),
  ),
) {}

// ----- UPDATE PORTFOLIO: SERVICES -----

export class UpdatePortfolioServicesDto extends createZodDto(
  UpdatePortfolioSectionDto.schema.and(
    z.object({
      items: z.array(
        z.object({
          title: z.string().nonempty('Required').max(64).trim(),
          description: z.string().nonempty('Required').max(512).trim(),
          icon: z.string().nonempty('Required').max(64).trim(),
        }),
      ),
    }),
  ),
) {}

// ----- UPDATE PORTFOLIO: ABOUT ME -----

export class UpdatePortfolioAboutMeDto extends createZodDto(
  z.object({
    title: z.string().nonempty('Required').max(64).trim(),
    content: z.string().nonempty('Required').max(4096).trim(),
  }),
) {}

// ----- UPDATE: PORTFOLIO -----

export class UpdatePortfolioDto extends createZodDto(
  z.object({
    opening: UpdatePortfolioOpeningDto.schema,
    selectionOfWorks: UpdatePortfolioSelectionDto.schema,
    selectionOfIdeas: UpdatePortfolioSelectionDto.schema,
    services: UpdatePortfolioServicesDto.schema,
    aboutMe: UpdatePortfolioAboutMeDto.schema,
    contact: UpdatePortfolioSectionDto.schema,
  }),
) {}
