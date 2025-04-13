'use client';

/* eslint-disable no-param-reassign */

import { DataType } from '@zpanel/core';
import { get } from 'lodash';

import Service, { takeData } from '../service';

type MediaType = DataType.UnsyncedMediaDto | DataType.MediaDto;

// ----------

async function resolveMediaList(mediaList: MediaType[]) {
  const mediaListWithIndex = mediaList.map((media, i) => ({ ...media, index: i }));

  const unresolvedMediaList = mediaListWithIndex.filter(
    (media): media is DataType.UnsyncedMediaDto & { index: number } =>
      Boolean('file' in media && media.file),
  );

  if (unresolvedMediaList.length === 0) return;

  const resolvedMediaList = await uploadMedia(unresolvedMediaList);

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

  if (value && typeof value === 'object' && 'file' in value && value.file) {
    await resolveMedia(value);
  }
}

/**
 * Resolve the media by uploading the file if it is an unsynced media.
 *
 * This is a function specialized for our file upload system,
 * it should be used right before submitting the form.
 *
 * **!! Notice that this function mutates the media object directly.**
 */
export async function resolveMedia(media?: MediaType) {
  if (!media) return null;

  await resolveMediaList([media]);
}
resolveMedia.list = resolveMediaList;
resolveMedia.byPath = resolveMediaByPath;

// ----- API -----

const api = new Service();

const uploadMedia = (mediaList: DataType.UnsyncedMediaDto[]) => {
  const form = new FormData();
  mediaList.forEach((media) => form.append('files', media.file));
  return takeData<DataType.MediaDto[]>(
    api.post('/media', form, { headers: { 'Content-Type': 'multipart/form-data' } }),
  );
};
