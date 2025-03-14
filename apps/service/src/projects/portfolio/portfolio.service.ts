import { Inject, Injectable } from '@nestjs/common';
import { EMediaStatus, EObjectCode, UpdatePortfolioDto } from '@zpanel/core';

import { Inspector } from 'utils';
import { DatabaseService } from 'src/database';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { Prisma } from '@prisma/client';

// ----------

@Injectable()
export class PortfolioService {
  constructor(
    private readonly dbs: DatabaseService,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  public getPortfolioObject = async () => {
    return await this.dbs.object.findUnique({
      include: { medias: true, lastModifier: true },
      where: { code: EObjectCode.PORTFOLIO },
    });
  };

  public updatePortfolio = async (updatePortfolioDto: UpdatePortfolioDto) => {
    const userId = this.request.signedInInfo.userId;
    const medias = this.findRelatedMedias(updatePortfolioDto);

    await this.dbs.$transaction(async () => {
      const input: Prisma.ObjectUpdateInput & Prisma.ObjectCreateInput = {
        code: EObjectCode.PORTFOLIO,
        data: JSON.stringify(updatePortfolioDto),
        medias: { connect: medias.map((media) => ({ clientId: media.id })) },
        lastModifier: { connect: { clientId: userId } },
      };

      const { medias: presentConnectedMedia } = await this.dbs.object.upsert({
        create: input,
        update: input,
        where: { code: EObjectCode.PORTFOLIO },
        select: { medias: { select: { clientId: true } } },
      });

      const newMediaIds = medias.map((media) => media.id);
      const presentConnectedMediaIds = presentConnectedMedia.map(
        (media) => media.clientId,
      );

      await this.dbs.media.updateMany({
        data: { status: EMediaStatus.UNUSED },
        where: {
          clientId: {
            notIn: newMediaIds,
            in: presentConnectedMediaIds,
          },
        },
      });
    });
  };

  // --- PRIVATE ---

  private findRelatedMedias = (updatePortfolioDto: UpdatePortfolioDto) => {
    return [
      updatePortfolioDto.opening.cv,
      updatePortfolioDto.opening.avatar,
      ...updatePortfolioDto.selectionOfWorks.items
        .concat(updatePortfolioDto.selectionOfIdeas.items)
        .map((item) => item.img),
    ];
  };
}
