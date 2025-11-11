import type { AxiosResponse } from 'axios';
import type { InterceptorFn } from '../../base';

export const responseInterceptor: InterceptorFn<AxiosResponse> = (response: AxiosResponse) => {
  return response.data;
};
