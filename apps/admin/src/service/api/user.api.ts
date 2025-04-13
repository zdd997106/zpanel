import {
  DataType,
  FindUserNotificationsCountDto,
  FindUserNotificationsDto,
  FindUsersDto,
  RequestToUpdateUserEmailDto,
  UpdateUserProfileDto,
  UpdateUserEmailDto,
  UpdateUserPasswordDto,
  UpdateUsersNotificationsAllDto,
  UpdateUsersNotificationsDto,
  UpdateUserDto,
  CreateUserDto,
} from '@zpanel/core';

import Service, { takeData } from '@zpanel/ui/service';

// ----- CONTEXT -----

const ENDPOINT = `/users`;
const api = new Service();

// ---- GET: ALL USERS ------

export const getUsers = (payload: Partial<FindUsersDto>) =>
  takeData<DataType.Paged<DataType.UserDto>>(api.get(getUsers.getPath(), payload));
getUsers.getPath = () => `${ENDPOINT}`;

// ---- GET: USER DETAIL ------

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

// --- CREATE: CREATE USER ------

export const createUser = (payload: CreateUserDto) =>
  takeData<DataType.UserDto>(api.post(createUser.getPath(), payload));
createUser.getPath = () => `${ENDPOINT}`;

// ---- PUT: UPDATE USER ------

export const updateUser = (id: string, payload: UpdateUserDto) =>
  takeData<null>(api.put(updateUser.getPath(id), payload));
updateUser.getPath = (id: string) => `${ENDPOINT}/${id}`;

// ---- PUT: UPDATE USER PROFILE ------

export const updateUserProfile = (id: string, payload: UpdateUserProfileDto) =>
  takeData<null>(api.put(updateUserProfile.getPath(id), payload));
updateUserProfile.getPath = (id: string) => `${ENDPOINT}/${id}/profile`;

// ---- POST: REQUEST TO UPDATE USER EMAIL ------

export const requestToUpdateUserEmail = (id: string, payload: RequestToUpdateUserEmailDto) =>
  takeData<null>(api.post(requestToUpdateUserEmail.getPath(id), payload));
requestToUpdateUserEmail.getPath = (id: string) => `${ENDPOINT}/${id}/request-to-update-email`;

// ---- PATCH: UPDATE USER EMAIL ------

export const updateUserEmail = (id: string, payload: UpdateUserEmailDto) =>
  takeData<null>(api.patch(updateUserEmail.getPath(id), payload));
updateUserEmail.getPath = (id: string) => `${ENDPOINT}/${id}/email`;

// ---- POST: UPDATE USER PASSWORD ------

export const updateUserPassword = (id: string, payload: UpdateUserPasswordDto) =>
  takeData<null>(api.patch(updateUserPassword.getPath(id), payload));
updateUserPassword.getPath = (id: string) => `${ENDPOINT}/${id}/password`;

// ---- PATCH: UPDATE USER NOTIFICATIONS ------

export const updateUsersNotifications = (id: string, payload: UpdateUsersNotificationsDto) =>
  takeData<null>(api.patch(updateUsersNotifications.getPath(id), payload));
updateUsersNotifications.getPath = (id: string) => `${ENDPOINT}/${id}/notifications`;

// ---- PATCH: UPDATE ALL USER NOTIFICATIONS ------

export const updateUsersNotificationsAll = (id: string, payload: UpdateUsersNotificationsAllDto) =>
  takeData<null>(api.patch(updateUsersNotificationsAll.getPath(id), payload));
updateUsersNotificationsAll.getPath = (id: string) => `${ENDPOINT}/${id}/notifications/all`;

// ---- DELETE: DISCOUNT USER EMAIL ------

export const discountUserEmail = (id: string) =>
  takeData<null>(api.delete(discountUserEmail.getPath(id)));
discountUserEmail.getPath = (id: string) => `${ENDPOINT}/${id}/email`;

// ---- DELETE: DELETE USER ------

export const deleteUser = (id: string) => takeData<null>(api.delete(deleteUser.getPath(id)));
deleteUser.getPath = (id: string) => `${ENDPOINT}/${id}`;
