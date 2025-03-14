import { DataType } from '@zpanel/core';
import { v4 as uuid } from 'uuid';

// ---------

export function createMedia(file: File): DataType.UnsyncedMediaDto {
  return {
    file,
    id: uuid(),
    url: URL.createObjectURL(file),
    name: file.name,
    size: file.size,
    mineTypes: file.type,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
