'use client';

/* eslint-disable no-param-reassign */

import { DataType } from '@zpanel/core';
import { get } from 'lodash';

type Media = DataType.UnsyncedMediaDto | DataType.MediaDto;

async function resolveMediaList(mediaList: Media[]) {
  const mediaListWithIndex = mediaList.map((media, i) => ({ ...media, index: i }));

  const unresolvedMediaList = mediaListWithIndex.filter(
    (media): media is DataType.UnsyncedMediaDto & { index: number } =>
      Boolean('file' in media && media.file),
  );

  const { uploadMedia } = await import('src/service/api/media.api'); // [NOTE]: Importing dynamically to avoid circular dependency
  const resolvedMediaList = await uploadMedia(
    unresolvedMediaList.length > 0 ? unresolvedMediaList : [],
  );

  resolvedMediaList.forEach((media, index) => {
    const targetIndex = unresolvedMediaList[index].index;
    mediaList[targetIndex].id = media.id;
    delete (mediaList[targetIndex] as any).file;
  });
}

async function resolveMediaByPath(values: any, path: string) {
  const value = get(values, path);

  if (Array.isArray(value)) {
    await resolveMedia.list(value);
  }

  if (typeof value === 'object' && 'file' in value && value.file) {
    await resolveMedia(value);
  }
}

export async function resolveMedia(media?: Media) {
  if (!media) return null;

  await resolveMediaList([media]);
}
resolveMedia.list = resolveMediaList;
resolveMedia.byPath = resolveMediaByPath;
