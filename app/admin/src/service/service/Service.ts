import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { ServiceEvent } from 'src/utils';

// ----------

export default class Service {
  private instance: AxiosInstance;

  constructor(baseURL: string = '/api') {
    this.instance = axios.create({
      baseURL,
      // Enable withCredentials setting on the current pack-mode is production mode
      withCredentials: process.env.NODE_ENV === 'production',
    });

    this.instance.interceptors.response.use(undefined, (error) => {
      if (!(error instanceof AxiosError)) {
        throw error;
      }

      if (error.response?.status === 401) {
        ServiceEvent.createRequestUnauthenticatedEvent().dispatch();
      }

      if (error.response?.status === 403) {
        ServiceEvent.createRequestForbiddenEvent().dispatch();
      }

      throw error;
    });
  }

  public async get<TData = any, TPayload = any>(
    path: string,
    payload?: TPayload,
    config?: AxiosRequestConfig<TData>,
  ) {
    return this.instance.get<TData>(path, { ...config, params: payload });
  }

  public async post<TData = any, TPayload = any>(
    path: string,
    payload?: TPayload,
    config?: AxiosRequestConfig<TData>,
  ) {
    return this.instance.post<TData>(path, payload, config);
  }

  public async delete<TData = any, TPayload = any>(
    path: string,
    payload?: TPayload,
    config?: AxiosRequestConfig<TData>,
  ) {
    return this.instance.delete<TData>(path, { ...config, params: payload });
  }

  public async put<TData = any, TPayload = any>(
    path: string,
    payload?: TPayload,
    config?: AxiosRequestConfig<TData>,
  ) {
    return this.instance.put<TData>(path, payload, config);
  }

  public async patch<TData = any, TPayload = any>(
    path: string,
    payload?: TPayload,
    config?: AxiosRequestConfig<TData>,
  ) {
    return this.instance.patch<TData>(path, payload, config);
  }
}
