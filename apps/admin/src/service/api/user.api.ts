import { DataType, UpdateUserPasswordDto, UpdateUserRoleDto } from '@zpanel/core';

import Service, { takeData } from 'src/service/service';

// ----- CONTEXT -----

const ENDPOINT = `/users`;
const api = new Service();

// ---- POST: UPDATE USER PASSWORD ------

export const getAllUsers = () => takeData<DataType.UserDto[]>(api.get(getAllUsers.getPath()));
getAllUsers.getPath = () => `${ENDPOINT}`;

// ---- POST: UPDATE USER PASSWORD ------

export const updateUserRole = (id: string, payload: UpdateUserRoleDto) =>
  takeData<null>(api.post(updateUserRole.getPath(id), payload));
updateUserRole.getPath = (id: string) => `${ENDPOINT}/${id}/role`;

// ---- POST: UPDATE USER PASSWORD ------

export const updateUserPassword = (payload: UpdateUserPasswordDto) =>
  takeData<null>(api.post(updateUserPassword.getPath(), payload));
updateUserPassword.getPath = () => `${ENDPOINT}/password`;
