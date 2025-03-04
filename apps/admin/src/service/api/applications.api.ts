import { ApproveApplicationDto, DataType, RejectApplicationDto } from '@zpanel/core';

import Service, { takeData } from 'src/service/service';

// ----- CONTEXT -----

const ENDPOINT = `/applications`;
const api = new Service();

// ---- GET: ALL APPLICATION ------

export const getAllApplications = () =>
  takeData<DataType.ApplicationDto[]>(api.get(getAllApplications.getPath()));
getAllApplications.getPath = () => `${ENDPOINT}`;

// ----- POST: APPROVE APPLICATION ------

export const approveApplication = (id: string, payload: ApproveApplicationDto) =>
  takeData<void>(api.post(approveApplication.getPath(id), payload));
approveApplication.getPath = (id: string) => `${ENDPOINT}/${id}/approve`;

// ----- POST: REJECT APPLICATION ------

export const rejectApplication = (id: string, payload: RejectApplicationDto) =>
  takeData<void>(api.post(rejectApplication.getPath(id), payload));
rejectApplication.getPath = (id: string) => `${ENDPOINT}/${id}/reject`;

// ----- DELETE: DELETE APPLICATION ------

export const deleteApplication = (id: string) =>
  takeData<void>(api.delete(deleteApplication.getPath(id)));
deleteApplication.getPath = (id: string) => `${ENDPOINT}/${id}`;
