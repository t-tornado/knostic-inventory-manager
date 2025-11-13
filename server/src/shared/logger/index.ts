import { inspect } from "util";

export interface LogContext {
  [key: string]: unknown;
}

export class Logger {
  private static formatLogEntry(entry: Record<string, unknown>): string {
    return inspect(entry, {
      depth: null,
      colors: true,
      compact: false,
      sorted: true,
    });
  }

  static error(message: string, error: Error, context?: LogContext): void {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level: "ERROR",
      message,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      context: context || {},
    };

    console.error(this.formatLogEntry(logEntry));
  }

  static info(message: string, context?: LogContext): void {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level: "INFO",
      message,
      context: context || {},
    };

    console.log(this.formatLogEntry(logEntry));
  }

  static warn(message: string, context?: LogContext): void {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level: "WARN",
      message,
      context: context || {},
    };

    console.warn(this.formatLogEntry(logEntry));
  }

  static debug(message: string, context?: LogContext): void {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level: "DEBUG",
      message,
      context: context || {},
    };

    if (process.env.NODE_ENV === "development") {
      console.debug(this.formatLogEntry(logEntry));
    }
  }
}
