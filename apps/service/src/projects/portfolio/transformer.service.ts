import { Injectable } from '@nestjs/common';
import { DataType, UpdatePortfolioDto } from '@zpanel/core';

import { Model } from 'modules/database';
import { TransformerService as MediaTransformerService } from 'src/media/transformer.service';

// ----------

@Injectable()
export class TransformerService {
  constructor(private readonly mediaService: MediaTransformerService) {}

  public toPortfolioDto = async (
    object:
      | (Model.Object & {
          medias: Model.Media[];
          lastModifier: Model.User | null;
        })
      | null,
  ): Promise<DataType.PortfolioDto | null> => {
    if (!object) return null;

    let data: UpdatePortfolioDto = null as never;

    try {
      data = JSON.parse(object.data);
    } catch {
      return null;
    }

    const mediaMap = Object.fromEntries(
      object.medias.map((media) => [
        media.clientId,
        this.mediaService.toMediaDto(media),
      ]),
    );

    return {
      ...data,
      opening: {
        ...data.opening,
        avatar: mediaMap[data.opening.avatar.id],
        cv: mediaMap[data.opening.cv.id],
      },
      selectionOfWorks: {
        ...data.selectionOfWorks,
        items: data.selectionOfWorks.items.map((item) => ({
          ...item,
          img: mediaMap[item.img.id],
        })),
      },
      selectionOfIdeas: {
        ...data.selectionOfIdeas,
        items: data.selectionOfIdeas.items.map((item) => ({
          ...item,
          img: mediaMap[item.img.id],
        })),
      },
    };
  };
}
