import { CreateRoleDto, DataType } from '@zpanel/core';

import Service, { takeData } from 'src/service/service';

// ----- CONTEXT -----

const ENDPOINT = `/roles`;
const api = new Service();

// ----- GET: ALL ROLES -----

export const getAllRoles = () => takeData<DataType.RoleDto[]>(api.get(getAllRoles.getPath()));
getAllRoles.getPath = () => `${ENDPOINT}`;

export const getRoleOptions = () =>
  takeData<DataType.SelectOptionDto[]>(api.get(getRoleOptions.getPath()));
getRoleOptions.getPath = () => `${ENDPOINT}/options`;

// ----- POST: CREATE ROLE ------

export const createRole = (payload: CreateRoleDto) =>
  takeData<void>(api.post(createRole.getPath(), payload));
createRole.getPath = () => `${ENDPOINT}`;

// ----- GET: GET ROLE DETAIL ------

export const getRoleDetail = (id: string) =>
  takeData<DataType.RoleDetailDto>(api.get(getRoleDetail.getPath(id)));
getRoleDetail.getPath = (id: string) => `${ENDPOINT}/${id}`;

// ----- PUT: UPDATE ROLE ------

export const updateRole = (id: string, payload: CreateRoleDto) =>
  takeData<void>(api.put(updateRole.getPath(id), payload));
updateRole.getPath = (id: string) => `${ENDPOINT}/${id}`;

// ----- DELETE: DELETE ROLE ------

export const deleteRole = (id: string) => takeData<void>(api.delete(deleteRole.getPath(id)));
deleteRole.getPath = (id: string) => `${ENDPOINT}/${id}`;
