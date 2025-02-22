import { AxiosError, AxiosResponse } from 'axios';
import { Api } from '@zpanel/core';

import ServiceError from './ServiceError';

// ----------

export async function takeData<TData>(
  response:
    | AxiosResponse<Api.Response<TData> | Api.ErrorResponse, any>
    | Promise<AxiosResponse<Api.Response<TData> | Api.ErrorResponse, any>>,
) {
  try {
    const { data: responseData } = await response;

    if ('message' in responseData && responseData.message) {
      throw new ServiceError(responseData);
    }

    return responseData.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const responseErrorData: Api.ErrorResponse = error.response?.data;
      throw new ServiceError({
        ...responseErrorData,
        statusCode: responseErrorData?.statusCode ?? 0,
        message: responseErrorData?.message ?? error.message,
        timestamp: responseErrorData?.timestamp ?? new Date(),
      });
    }

    if (error instanceof Error) {
      throw new ServiceError({
        statusCode: 0,
        path: '' as never,
        error,
        message: 'Something went wrong',
        timestamp: new Date(),
      });
    }
  }
}
