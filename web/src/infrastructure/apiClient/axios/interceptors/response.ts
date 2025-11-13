import type { AxiosResponse } from "axios";
import type { InterceptorFn } from "../../base";

export const responseInterceptor: InterceptorFn<
  AxiosResponse<unknown, unknown, unknown>
> = (response: AxiosResponse<unknown, unknown, unknown>) => {
  return response.data as unknown as AxiosResponse<unknown, unknown, unknown>;
};
