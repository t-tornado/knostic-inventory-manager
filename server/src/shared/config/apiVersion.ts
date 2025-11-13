/**
 * API Version Configuration
 *
 * To upgrade the API version, simply change the CURRENT_VERSION value.
 * All routes will automatically use the new version.
 *
 */
export const CURRENT_API_VERSION = "v1";

/**
 * Get the API base path with version
 * @returns The versioned API base path (e.g., "/api/v1")
 */
export function getApiBasePath(): string {
  return `/api/${CURRENT_API_VERSION}`;
}

/**
 * Build a versioned API path
 * @param path - The endpoint path (e.g., "/stores" or "stores")
 * @returns The full versioned path (e.g., "/api/v1/stores")
 */
export function apiPath(path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${getApiBasePath()}${cleanPath}`;
}
