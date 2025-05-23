import { v4 as uuid } from 'uuid';
import { DataType } from '@zpanel/core';

import { env } from './env';

// ---------

/**
 * Create a media object from a file or an existing media object.
 *
 * This is a function specialized for our file upload system,
 * it creates a media object with a URL and essential properties.
 */
export function createMedia(file: File): DataType.UnsyncedMediaDto;
export function createMedia(unsyncedMedia: DataType.UnsyncedMediaDto): DataType.UnsyncedMediaDto;
export function createMedia(media: DataType.MediaDto): DataType.AccessibleMediaDto;

export function createMedia(target: File | DataType.MediaDto | DataType.UnsyncedMediaDto) {
  if ('url' in target) return target;

  if (target instanceof File) {
    return {
      file: target,
      id: uuid(),
      url: URL.createObjectURL(target),
      name: target.name,
      size: target.size,
      mineTypes: target.type,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  return {
    ...target,
    url: createMedia.url(target),
  };
}

/**
 * Create or extract the URL from a media object.
 */
createMedia.url = (
  media: DataType.MediaDto | DataType.UnsyncedMediaDto | DataType.AccessibleMediaDto,
) => {
  if ('url' in media) return media.url;
  return `${env.getOrThrow('API_BASE_URL')}/media/${media.id}`;
};
