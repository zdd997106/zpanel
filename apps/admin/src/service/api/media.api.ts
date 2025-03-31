import { DataType } from '@zpanel/core';

import Service, { takeData } from '@zpanel/ui/service';

// ----------

const ENDPOINT = `/media`;
const api = new Service();

// ----------

export const uploadMedia = (mediaList: DataType.UnsyncedMediaDto[]) => {
  const form = new FormData();
  mediaList.forEach((media) => form.append('files', media.file));
  return takeData<DataType.UnsyncedMediaDto[]>(
    api.post(uploadMedia.getPath(), form, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  );
};
uploadMedia.getPath = () => `${ENDPOINT}/images`;
