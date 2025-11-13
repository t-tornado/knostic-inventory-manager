import type { AxiosResponse, AxiosError } from "axios";
import type { ApiResponse } from "@/shared/api";

export const responseInterceptor = (response: AxiosResponse) => {
  return response;
};

export const errorInterceptor = (
  error: AxiosError<ApiResponse<unknown>>
): Promise<never> => {
  if (error.response?.data) {
    const responseData = error.response.data;

    if (
      responseData &&
      typeof responseData === "object" &&
      "errors" in responseData &&
      Array.isArray(responseData.errors) &&
      responseData.errors.length > 0
    ) {
      const errorMessages = responseData.errors
        .map((err: { message?: string }) => err.message)
        .filter(Boolean)
        .join(", ");

      const extractedError = new Error(errorMessages);
      (extractedError as Error & { originalError: AxiosError }).originalError =
        error;
      return Promise.reject(extractedError);
    }
  }

  const status = error.response?.status;
  const statusText = error.response?.statusText || "Unknown error";
  const message = status
    ? `Request failed with status ${status}: ${statusText}`
    : error.message || "Network error occurred";

  const genericError = new Error(message);
  (genericError as Error & { originalError: AxiosError }).originalError = error;
  return Promise.reject(genericError);
};
