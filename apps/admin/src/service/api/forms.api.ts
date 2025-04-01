import { DataType, FindAllNotificationsDto, UpdateContactMeFormSubmissionDto } from '@zpanel/core';

import Service, { takeData } from '@zpanel/ui/service';

// ----- CONTEXT -----

const ENDPOINT = `/forms`;
const api = new Service();

// ---- GET: ALL CONTACT ME SUBMISSIONS ------

export const findAllContactMeSubmissions = (
  findAllContactMeSubmissionsDto: Partial<FindAllNotificationsDto> = {},
) =>
  takeData<DataType.Paged<DataType.ContractMeForm.SubmissionDto>>(
    api.get(findAllContactMeSubmissions.getPath(), findAllContactMeSubmissionsDto),
  );
findAllContactMeSubmissions.getPath = () => `${ENDPOINT}/contact-me/submissions`;

// ---- GET: CONTACT ME SUBMISSION DETAILS ------

export const getContactMeSubmission = (id: string) =>
  takeData<DataType.ContractMeForm.SubmissionDetailDto>(
    api.get(getContactMeSubmission.getPath(id)),
  );
getContactMeSubmission.getPath = (id: string) => `${ENDPOINT}/contact-me/submissions/${id}`;

// ----- PATCH: ARCHIVE A CONTACT ME SUBMISSION ------

export const updateContactMeSubmission = (
  id: string,
  updateContactMeFormSubmission: UpdateContactMeFormSubmissionDto,
) =>
  takeData<void>(api.patch(updateContactMeSubmission.getPath(id), updateContactMeFormSubmission));
updateContactMeSubmission.getPath = (id: string) => `${ENDPOINT}/contact-me/submissions/${id}`;

// ----- DELETE: DELETE A CONTACT ME SUBMISSION ------

export const deleteContactMeSubmission = (id: string) =>
  takeData<void>(api.delete(deleteContactMeSubmission.getPath(id)));
deleteContactMeSubmission.getPath = (id: string) => `${ENDPOINT}/contact-me/submissions/${id}`;
