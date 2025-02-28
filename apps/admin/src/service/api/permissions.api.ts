import { DataType, UpdatePermissionsDto } from '@zpanel/core';

import Service, { takeData } from 'src/service/service';

// ----- CONTEXT -----

const ENDPOINT = `/permissions`;
const api = new Service();

// ----- GET: ALL PERMISSIONS -----

export const getAllPermissions = () =>
  takeData<DataType.PermissionDto[]>(api.get(getAllPermissions.getPath()));
getAllPermissions.getPath = () => `${ENDPOINT}`;

// ----- POST: UPDATE USER PASSWORD ------

export const updatePermissions = (payload: UpdatePermissionsDto) =>
  takeData<void>(api.patch(updatePermissions.getPath(), payload));
updatePermissions.getPath = () => `${ENDPOINT}`;
