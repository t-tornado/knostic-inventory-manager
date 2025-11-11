import type { InternalAxiosRequestConfig } from 'axios';
import type { InterceptorFn } from '../../base';

export const requestInterceptor: InterceptorFn<InternalAxiosRequestConfig> = (
  config: InternalAxiosRequestConfig,
) => {
  return config;
};
