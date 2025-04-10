import {
  SignInDto,
  SignUpDto,
  RequestToResetPasswordDto,
  // EPermission,
  DataType,
  ResetPasswordDto,
} from '@zpanel/core';

import Service, { takeData } from '@zpanel/ui/service';

// ----- CONTEXT -----

const ENDPOINT = `/auth`;
const api = new Service();

// ----- GET: DETAIL OF CURRENT USER -----

export const getAuthUser = () => takeData<DataType.AuthUserDto>(api.get(getAuthUser.getPath()));
getAuthUser.getPath = () => `${ENDPOINT}`;

// ----- POST: SIGN IN -----

export const signIn = (payload: SignInDto) => takeData<null>(api.post(signIn.getPath(), payload));
signIn.getPath = () => `${ENDPOINT}/sign-in`;

// ----- POST: SIGN UP -----

export const signUp = (payload: SignUpDto) => takeData<null>(api.post(signUp.getPath(), payload));
signUp.getPath = () => `${ENDPOINT}/sign-up`;

// ----- POST: SIGN OUT -----

export const signOut = () => takeData<null>(api.post(signOut.getPath()));
signOut.getPath = () => `${ENDPOINT}/sign-out`;

// ---- POST: REQUEST TO RESET PASSWORD ------

export const requestToResetPassword = (payload: RequestToResetPasswordDto) =>
  takeData<null>(api.post(requestToResetPassword.getPath(), payload));
requestToResetPassword.getPath = () => `${ENDPOINT}/request-to-reset-password`;

// ----- POST: SIGN UP -----

export const resetPassword = (payload: ResetPasswordDto) =>
  takeData<null>(api.post(resetPassword.getPath(), payload));
resetPassword.getPath = () => `${ENDPOINT}/reset-password`;

// ----- GET: PERMISSION KEYS -----

export const getPermissionKeys = () => takeData<string[]>(api.get(getPermissionKeys.getPath()));
getPermissionKeys.getPath = () => `${ENDPOINT}/permissions`;
