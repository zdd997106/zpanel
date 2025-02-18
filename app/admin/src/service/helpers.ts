import { AxiosError, AxiosResponse } from 'axios';

import { ServiceResult } from './types';
import { ServiceError } from './classes';

// ----------

export async function takeData<TData>(
  response:
    | AxiosResponse<ServiceResult<TData>, any>
    | Promise<AxiosResponse<ServiceResult<TData>, any>>,
) {
  try {
    const { data: responseData } = await response;

    if (responseData.message) {
      throw new ServiceError(responseData);
    }

    return responseData.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const responseErrorData: ServiceResult<null> = error.response?.data;
      throw new ServiceError({
        ...responseErrorData,
        statusCode: responseErrorData?.statusCode ?? 0,
        message: responseErrorData?.message ?? error.message,
        timeStamp: responseErrorData?.timeStamp ?? new Date(),
      });
    }

    throw new ServiceError({
      statusCode: 0,
      error,
      message: 'Something went wrong',
      timeStamp: new Date(),
    });
  }
}
