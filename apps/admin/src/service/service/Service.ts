import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { env, ServiceEvent } from 'src/utils';

// ----------

export default class Service {
  private instance: AxiosInstance;

  constructor(baseURL: string = env.getOrThrow('API_BASE_URL')) {
    this.instance = axios.create({
      baseURL,
      withCredentials: true, // Send cookies with requests
    });

    this.instance.interceptors.request.use(async (config) => {
      // Ensure the request is only executed in the server environment
      if (isClient()) return config;

      const { cookies } = await import('next/headers');
      const cookiesStore = await cookies();
      config.headers.set('Cookie', cookiesStore.toString());
      return config;
    });

    this.instance.interceptors.response.use(undefined, (error) => {
      // Ensure the error handling is only executed in the browser environment
      if (!isClient()) throw error;

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
    return this.instance.get<TData>(path, {
      ...config,
      params: payload,
      ...(!isClient() && { fetchOptions: { next: { tags: [path] } } }),
    });
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

// ----- HELPERS -----

const isClient = () => !!globalThis.window;
