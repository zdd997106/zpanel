import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

import { env } from 'src/utils/env';
import ServiceEvent from 'src/utils/ServiceEvent';

// ----------

export default class Service {
  private instance: AxiosInstance;

  constructor(baseURL: string = env.getOrThrow('API_BASE_URL')) {
    this.instance = axios.create({
      baseURL,
      withCredentials: true, // Send cookies with requests
    });

    this.instance.interceptors.request.use(async (config) => {
      if (isServer()) {
        // Set cookies for server-side requests
        const { cookies } = await import('next/headers');
        const cookiesStore = await cookies();
        config.headers.set('Cookie', cookiesStore.toString());
      }

      // CSRF Protection: GET requests do not require CSRF protection
      if (!['GET', 'HEAD', 'OPTIONS'].includes(config.method!)) {
        config.headers.set('x-csrf-token', (await getCookie('x-csrf-token')) || '');
      }

      return config;
    });

    this.instance.interceptors.response.use(undefined, (error) => {
      // Ensure the error handling is only executed in the browser environment
      if (isServer()) throw error;

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

// ----- HELPERS -----

const isClient = () => !!globalThis.window;

const isServer = () => !isClient();

const getCookie = async (name: string) => {
  if (isServer()) {
    const { cookies } = await import('next/headers');
    const cookiesStore = await cookies();
    return cookiesStore.get(name)?.value;
  }

  const cookies = Object.fromEntries(
    document.cookie.split(';').map((cookie) => cookie.trim().split('=') as [string, string]),
  );
  return cookies[name];
};
