import { dotenv } from "@/shared/config";
import { createAxiosApiClient } from "./factory";
import { requestInterceptor } from "./interceptors/request";
import { responseInterceptor } from "./interceptors/response";

const apiClient = createAxiosApiClient(
  dotenv.API_URL,
  requestInterceptor,
  responseInterceptor
);

export { apiClient };
