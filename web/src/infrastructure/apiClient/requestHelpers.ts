import type { IApiClient } from "./types";
import type { ApiResponse } from "@/shared/api";

/**
 *
 * @param response
 *
 * We need helpers to interact with the api client from handling requests to responses. we use this
 * well abstracted. if we need more control, lets extend the helpers or create new ones.
 */

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
  apiClient: IApiClient,
  url: string,
  defaultErrorMessage: string
): Promise<T> {
  try {
    const response = await apiClient.get<ApiResponse<T>>(url);
    return handleApiResponse(response.data, defaultErrorMessage);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(defaultErrorMessage);
  }
}

export async function postRequest<T>(
  apiClient: IApiClient,
  url: string,
  data: unknown,
  defaultErrorMessage: string
): Promise<T> {
  try {
    const response = await apiClient.post<ApiResponse<T>>(url, data);
    return handleApiResponse(response.data, defaultErrorMessage);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(defaultErrorMessage);
  }
}

export async function putRequest<T>(
  apiClient: IApiClient,
  url: string,
  data: unknown,
  defaultErrorMessage: string
): Promise<T> {
  try {
    const response = await apiClient.put<ApiResponse<T>>(url, data);
    return handleApiResponse(response.data, defaultErrorMessage);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(defaultErrorMessage);
  }
}

export async function deleteRequest(
  apiClient: IApiClient,
  url: string,
  defaultErrorMessage: string
): Promise<void> {
  try {
    const response = await apiClient.delete<ApiResponse<void>>(url);
    handleApiResponse(response.data, defaultErrorMessage);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(defaultErrorMessage);
  }
}
