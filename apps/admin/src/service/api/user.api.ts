import { UpdateUserPasswordDto } from '@zpanel/core';

import Service, { takeData } from 'src/service/service';

// ----- CONTEXT -----

const ENDPOINT = `/user`;
const api = new Service();

// ---- POST: UPDATE USER PASSWORD ------

export const updateUserPassword = (payload: UpdateUserPasswordDto) =>
  takeData<null>(api.post(updateUserPassword.getPath(), payload));
updateUserPassword.getPath = () => `${ENDPOINT}/password`;
