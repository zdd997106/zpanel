import {
  DataType,
  FindUserNotificationsCountDto,
  FindUserNotificationsDto,
  RequestToUpdateUserEmailDto,
  UpdateUserDto,
  UpdateUserEmailDto,
  UpdateUserPasswordDto,
  UpdateUserRoleDto,
  UpdateUsersNotificationsAllDto,
  UpdateUsersNotificationsDto,
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

// ---- GET: ALL USER NOTIFICATIONS ------

export const getUserNotifications = (id: string, payload: Partial<FindUserNotificationsDto>) =>
  takeData<DataType.Paged<DataType.UserNotificationDto>>(
    api.get(getUserNotifications.getPath(id), payload),
  );
getUserNotifications.getPath = (id: string) => `${ENDPOINT}/${id}/notifications`;

// ---- GET: LATEST A FEW USER NOTIFICATIONS ------

export const getLatestUserNotifications = (id: string) =>
  takeData<DataType.UserNotificationDto[]>(api.get(getLatestUserNotifications.getPath(id)));
getLatestUserNotifications.getPath = (id: string) => `${ENDPOINT}/${id}/notifications/latest`;

// ---- GET: USER NOTIFICATIONS COUNT ------

export const getUserNotificationCount = (id: string, payload: FindUserNotificationsCountDto = {}) =>
  takeData<number>(api.get(getUserNotificationCount.getPath(id), payload));
getUserNotificationCount.getPath = (id: string) => `${ENDPOINT}/${id}/notifications/count`;

// ---- GET: USER OPTIONS ------

export const getUserOptions = () =>
  takeData<DataType.SelectOptionDto[]>(api.get(getUserOptions.getPath()));
getUserOptions.getPath = () => `${ENDPOINT}/options`;

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

// ---- PATCH: UPDATE USER NOTIFICATIONS ------

export const updateUsersNotifications = (id: string, payload: UpdateUsersNotificationsDto) =>
  takeData<null>(api.patch(updateUsersNotifications.getPath(id), payload));
updateUsersNotifications.getPath = (id: string) => `${ENDPOINT}/${id}/notifications`;

// ---- PATCH: UPDATE ALL USER NOTIFICATIONS ------

export const updateUsersNotificationsAll = (id: string, payload: UpdateUsersNotificationsAllDto) =>
  takeData<null>(api.patch(updateUsersNotificationsAll.getPath(id), payload));
updateUsersNotificationsAll.getPath = (id: string) => `${ENDPOINT}/${id}/notifications/all`;
