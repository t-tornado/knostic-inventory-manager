export type LogLevel = "info" | "success" | "warning" | "error";

export interface LoggerOptions {
  featureFlagKey?: string;
  appName?: string;
  showTimestamp?: boolean;
  showMeta?: boolean;
}

export interface PayloadEvent {
  level: LogLevel;
  message: string;
  context?: string;
  payload?: unknown;
  timestamp: string;
  appName?: string;
  meta: {
    url?: string;
    userAgent?: string;
    stack?: string;
  };
}

type Consumer = (event: PayloadEvent) => void;

export class WebLogger {
  private featureFlagKey: string;
  private appName?: string;
  private showTimestamp: boolean;
  private static consumer: Consumer | undefined;
  private showMeta: boolean;
  constructor(opts: LoggerOptions = {}) {
    this.featureFlagKey = opts.featureFlagKey ?? "GistDebugMode";
    this.appName = opts.appName;
    this.showTimestamp = opts.showTimestamp ?? true;
    this.showMeta = opts.showMeta ?? true;
  }

  info(message: string, payload?: unknown, context?: string) {
    this.#log("info", message, payload as any, context);
  }
  success(message: string, payload?: unknown, context?: string) {
    this.#log("success", message, payload as any, context);
  }
  warning(message: string, payload?: unknown, context?: string) {
    this.#log("warning", message, payload as any, context);
  }
  error(message: string, payload?: unknown, context?: string) {
    this.#log("error", message, payload as any, context);
  }

  enable() {
    try {
      const localStorageValue = localStorage.getItem(this.featureFlagKey);
      if (!localStorageValue) {
        return (window as any)[this.featureFlagKey] === true;
      }
      return localStorageValue === "true";
    } catch {
      return (window as any)[this.featureFlagKey] === true;
    }
  }

  disable() {
    try {
      localStorage.removeItem(this.featureFlagKey);
      (window as any)[this.featureFlagKey] = false;
    } catch {
      (window as any)[this.featureFlagKey] = false;
    }
  }

  static setPayloadConsumer(consumer?: Consumer) {
    WebLogger.consumer = consumer;
  }

  #enabled(): boolean {
    try {
      const winFlag = Boolean((window as any)[this.featureFlagKey]);
      const localFlag = localStorage.getItem(this.featureFlagKey) === "true";
      return winFlag || localFlag;
    } catch {
      return false;
    }
  }

  #log(level: LogLevel, message: string, payload?: unknown, context?: string) {
    if (!this.#enabled()) return;

    const ts = new Date().toISOString();
    const badge = level.toUpperCase();

    const palette: Record<LogLevel, { bg: string; fg: string; icon: string }> =
      {
        info: { bg: "#2563eb", fg: "#ffffff", icon: "ℹ️" },
        success: { bg: "#16a34a", fg: "#ffffff", icon: "✅" },
        warning: { bg: "#d97706", fg: "#1f2937", icon: "⚠️" },
        error: { bg: "#dc2626", fg: "#ffffff", icon: "⛔" },
      };

    const { bg, fg, icon } = palette[level];

    const badgeStyle = `background:${bg}; color:${fg}; padding:2px 6px; border-radius:12px; font-weight:700;`;
    const mutedStyle = "color:#6b7280; font-weight:400;";
    const ctxStyle = "font-weight:700;";
    const appStyle = "color:#111827; font-weight:600;";

    const parts: string[] = [];
    const styles: string[] = [];

    parts.push("%c" + icon + " " + badge);
    styles.push(badgeStyle);

    if (this.appName) {
      parts.push(" %c[" + this.appName + "]");
      styles.push(appStyle);
    }

    if (this.showTimestamp) {
      parts.push(" %c" + ts);
      styles.push(mutedStyle);
    }

    if (context) {
      parts.push(" %c" + context);
      styles.push(ctxStyle);
    }

    parts.push(" — " + message);

    const header = parts.join("");

    const stack = new Error().stack?.split("\n").slice(2).join("\n");
    const meta = {
      url: typeof location !== "undefined" ? location.href : undefined,
      userAgent:
        typeof navigator !== "undefined" ? navigator.userAgent : undefined,
      stack,
    };

    console.groupCollapsed(header, ...styles);
    this.#kv("Level", level);
    this.#kv("Time", ts);
    if (this.appName) this.#kv("App", this.appName);
    if (context) this.#kv("Context", context, true);

    if (payload !== undefined) {
      this.#section("Payload");
      if (typeof payload === "object" && payload !== null) console.dir(payload);
      else console.log(payload);
    }

    if (this.showMeta) {
      this.#section("Meta");
      console.log({ url: meta.url, userAgent: meta.userAgent });
      if (meta.stack) {
        this.#section("Trace");
        console.log(meta.stack);
      }
    }

    console.groupEnd();

    if (WebLogger.consumer) {
      try {
        WebLogger.consumer({
          level,
          message,
          context,
          payload,
          timestamp: ts,
          appName: this.appName,
          meta,
        });
      } catch (err) {
        console.warn("WebLogger consumer threw:", err);
      }
    }
  }

  #section(title: string) {
    console.log(
      `%c${title}`,
      "font-weight:700; text-transform:uppercase; letter-spacing:.02em;"
    );
  }

  #kv(label: string, value: unknown, boldValue = false) {
    const l = "%c" + label + ":";
    const lStyle = "color:#374151; font-weight:600;";
    const vStyle = boldValue ? "font-weight:700;" : "";
    console.log(l, lStyle, value, vStyle);
  }
}

export const logger = new WebLogger({ showMeta: false, showTimestamp: false });
