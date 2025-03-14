import { Injectable } from '@nestjs/common';
import { DataType, UpdatePortfolioDto } from '@zpanel/core';

import { Model } from 'src/database';
import { TransformerService as MediaService } from 'src/media';

// ----------

@Injectable()
export class TransformerService {
  constructor(private readonly mediaService: MediaService) {}

  public toPortfolioDto = async (
    object:
      | (Model.Object & {
          medias: Model.Media[];
          lastModifier: Model.User | null;
        })
      | null,
  ): Promise<DataType.PortfolioDto | null> => {
    try {
      if (!object) throw Error();

      const data: UpdatePortfolioDto = JSON.parse(object.data);
      const mediaMap = Object.fromEntries(
        object.medias.map((media) => [
          media.clientId,
          this.mediaService.toAccessibleMediaDto(media),
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
    } catch {
      return null;
    }
  };
}
