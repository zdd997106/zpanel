import {
  DataType,
  RequestToUpdateUserEmailDto,
  UpdateUserDto,
  UpdateUserEmailDto,
  UpdateUserPasswordDto,
  UpdateUserRoleDto,
} from '@zpanel/core';

import Service, { takeData } from 'src/service/service';

// ----- CONTEXT -----

const ENDPOINT = `/users`;
const api = new Service();

// ---- GET: ALL USERS ------

export const getAllUsers = () => takeData<DataType.UserDto[]>(api.get(getAllUsers.getPath()));
getAllUsers.getPath = () => `${ENDPOINT}`;

// ---- GET: ALL USERS ------

export const getUserDetail = (id: string) =>
  takeData<DataType.UserDetailDto>(api.get(getUserDetail.getPath(id)));
getUserDetail.getPath = (id: string) => `${ENDPOINT}/${id}`;

// ---- GET: ALL USER APP KEYS ------

export const getUserAppKeys = (id: string) =>
  takeData<DataType.AppKeyDto[]>(api.get(getUserAppKeys.getPath(id)));
getUserAppKeys.getPath = (id: string) => `${ENDPOINT}/${id}/app-keys`;

// ---- POST: UPDATE USER ------

export const updateUser = (id: string, payload: UpdateUserDto) =>
  takeData<null>(api.post(updateUser.getPath(id), payload));
updateUser.getPath = (id: string) => `${ENDPOINT}/${id}`;

// ---- POST: UPDATE USER ROLE ------

export const updateUserRole = (id: string, payload: UpdateUserRoleDto) =>
  takeData<null>(api.post(updateUserRole.getPath(id), payload));
updateUserRole.getPath = (id: string) => `${ENDPOINT}/${id}/role`;

// ---- POST: REQUEST TO UPDATE USER EMAIL ------

export const requestToUpdateUserEmail = (id: string, payload: RequestToUpdateUserEmailDto) =>
  takeData<null>(api.post(requestToUpdateUserEmail.getPath(id), payload));
requestToUpdateUserEmail.getPath = (id: string) => `${ENDPOINT}/${id}/request-to-update-email`;

// ---- POST: UPDATE USER EMAIL ------

export const updateUserEmail = (id: string, payload: UpdateUserEmailDto) =>
  takeData<null>(api.post(updateUserEmail.getPath(id), payload));
updateUserEmail.getPath = (id: string) => `${ENDPOINT}/${id}/email`;

// ---- POST: UPDATE USER PASSWORD ------

export const updateUserPassword = (payload: UpdateUserPasswordDto) =>
  takeData<null>(api.post(updateUserPassword.getPath(), payload));
updateUserPassword.getPath = () => `${ENDPOINT}/password`;
