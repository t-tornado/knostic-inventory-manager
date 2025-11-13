import { logger } from "./logger";

/**
 * Lets not deal directly with the localStorage here. this abstraction will provide us a safe and observable layer for the localStorage.
 */
class LocalStorage {
  /**
   * Get a value from localStorage and safely parse it as JSON
   * @param key - The key to retrieve
   * @returns The parsed value or null if parsing fails or key doesn't exist
   */
  get<T>(key: string): T | null {
    try {
      const item = window.localStorage.getItem(key);

      if (item === null) {
        logger.info(
          `LocalStorage: Key "${key}" not found`,
          { key },
          "LocalStorage"
        );
        return null;
      }

      try {
        const parsed = JSON.parse(item) as T;
        logger.success(
          `LocalStorage: Successfully retrieved and parsed key "${key}"`,
          { key, value: parsed },
          "LocalStorage"
        );
        return parsed;
      } catch (parseError) {
        logger.error(
          `LocalStorage: Failed to parse value for key "${key}"`,
          { key, rawValue: item, error: parseError },
          "LocalStorage"
        );
        return null;
      }
    } catch (error) {
      logger.error(
        `LocalStorage: Error accessing localStorage for key "${key}"`,
        { key, error },
        "LocalStorage"
      );
      return null;
    }
  }

  /**
   * Set a value in localStorage (automatically stringifies)
   * @param key - The key to set
   * @param value - The value to store (will be JSON stringified)
   */
  set(key: string, value: unknown): void {
    try {
      const stringified = JSON.stringify(value);
      window.localStorage.setItem(key, stringified);
      logger.success(
        `LocalStorage: Successfully set key "${key}"`,
        { key, value },
        "LocalStorage"
      );
    } catch (error) {
      logger.error(
        `LocalStorage: Failed to set key "${key}"`,
        { key, value, error },
        "LocalStorage"
      );
      throw error;
    }
  }

  /**
   * Remove a value from localStorage
   * @param key - The key to remove
   */
  remove(key: string): void {
    try {
      window.localStorage.removeItem(key);
      logger.success(
        `LocalStorage: Successfully removed key "${key}"`,
        { key },
        "LocalStorage"
      );
    } catch (error) {
      logger.error(
        `LocalStorage: Failed to remove key "${key}"`,
        { key, error },
        "LocalStorage"
      );
    }
  }

  clear(): void {
    try {
      window.localStorage.clear();
      logger.success(
        "LocalStorage: Successfully cleared all items",
        {},
        "LocalStorage"
      );
    } catch (error) {
      logger.error(
        "LocalStorage: Failed to clear localStorage",
        { error },
        "LocalStorage"
      );
    }
  }

  has(key: string): boolean {
    try {
      const exists = window.localStorage.getItem(key) !== null;
      logger.info(
        `LocalStorage: Checked existence of key "${key}"`,
        { key, exists },
        "LocalStorage"
      );
      return exists;
    } catch (error) {
      logger.error(
        `LocalStorage: Error checking existence of key "${key}"`,
        { key, error },
        "LocalStorage"
      );
      return false;
    }
  }
}

export const localStorage = new LocalStorage();
