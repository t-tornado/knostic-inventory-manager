import type { BaseApiClient } from "./base";
import type { ApiResponse } from "@/shared/api";

function handleApiResponse<T>(
  response: ApiResponse<T>,
  defaultErrorMessage: string
): T {
  if (response.errors && response.errors.length > 0) {
    const errorMessages = response.errors.map((err) => err.message).join(", ");
    throw new Error(errorMessages || defaultErrorMessage);
  }

  if (!response.data) {
    throw new Error(defaultErrorMessage);
  }

  return response.data;
}

export function buildUrl(path: string, queryParams?: URLSearchParams): string {
  const queryString = queryParams?.toString();
  return `${path}${queryString ? `?${queryString}` : ""}`;
}

export async function getRequest<T>(
  apiClient: BaseApiClient,
  url: string,
  defaultErrorMessage: string
): Promise<T> {
  try {
    const response = await apiClient.get<ApiResponse<T>>(url);
    return handleApiResponse(response, defaultErrorMessage);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(defaultErrorMessage);
  }
}

export async function postRequest<T>(
  apiClient: BaseApiClient,
  url: string,
  data: unknown,
  defaultErrorMessage: string
): Promise<T> {
  try {
    const response = await apiClient.post<ApiResponse<T>>(url, data);
    return handleApiResponse(response, defaultErrorMessage);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(defaultErrorMessage);
  }
}

export async function putRequest<T>(
  apiClient: BaseApiClient,
  url: string,
  data: unknown,
  defaultErrorMessage: string
): Promise<T> {
  try {
    const response = await apiClient.put<ApiResponse<T>>(url, data);
    return handleApiResponse(response, defaultErrorMessage);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(defaultErrorMessage);
  }
}

export async function deleteRequest(
  apiClient: BaseApiClient,
  url: string,
  defaultErrorMessage: string
): Promise<void> {
  try {
    const response = await apiClient.delete<ApiResponse<void>>(url);
    handleApiResponse(response, defaultErrorMessage);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(defaultErrorMessage);
  }
}
