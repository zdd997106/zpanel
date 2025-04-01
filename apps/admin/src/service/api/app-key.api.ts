import { CreateAppKeyDto, DataType, UpdateAppKeyDto } from '@zpanel/core';

import Service, { takeData } from '@zpanel/ui/service';

// ----- CONTEXT -----

const ENDPOINT = `/app-keys`;
const api = new Service();

// ----- GET: ALL APP KEYS -----

export const getAllAppKeys = () => takeData<DataType.AppKeyDto[]>(api.get(getAllAppKeys.getPath()));
getAllAppKeys.getPath = () => `${ENDPOINT}`;

// ----- POST: GRANT APP KEY ------

export const grantAppKey = (payload: CreateAppKeyDto) =>
  takeData<void>(api.post(grantAppKey.getPath(), payload));
grantAppKey.getPath = () => `${ENDPOINT}`;

// ----- GET: GET APP KEY DETAIL ------

export const getAppKeyDetail = (id: string) =>
  takeData<DataType.AppKeyDetailDto>(api.get(getAppKeyDetail.getPath(id)));
getAppKeyDetail.getPath = (id: string) => `${ENDPOINT}/${id}`;

// ----- PUT: UPDATE APP KEY ------

export const updateAppKey = (id: string, payload: UpdateAppKeyDto) =>
  takeData<void>(api.put(updateAppKey.getPath(id), payload));
updateAppKey.getPath = (id: string) => `${ENDPOINT}/${id}`;

// ----- DELETE: REVOKE APP KEY ------

export const revokeAppKey = (id: string) => takeData<void>(api.delete(revokeAppKey.getPath(id)));
revokeAppKey.getPath = (id: string) => `${ENDPOINT}/${id}`;
