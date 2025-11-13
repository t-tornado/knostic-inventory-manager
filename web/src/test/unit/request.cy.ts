import { requestInterceptor } from "@/infrastructure/apiClient/axios/interceptors/request";
import type { InternalAxiosRequestConfig } from "axios";

describe("requestInterceptor", () => {
  it("should return config unchanged", () => {
    const config: InternalAxiosRequestConfig = {
      url: "/test",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    } as InternalAxiosRequestConfig;

    const result = requestInterceptor(config);

    expect(result).to.deep.equal(config);
    expect(result.url).to.equal("/test");
    expect(result.method).to.equal("GET");
    expect(result.headers?.["Content-Type"]).to.equal("application/json");
  });

  it("should preserve all config properties", () => {
    const config: InternalAxiosRequestConfig = {
      url: "/api/v1/dashboard",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer token123",
      },
      data: { test: "data" },
      params: { filter: "active" },
    } as InternalAxiosRequestConfig;

    const result = requestInterceptor(config);

    expect(result.url).to.equal("/api/v1/dashboard");
    expect(result.method).to.equal("POST");
    expect(result.headers?.Authorization).to.equal("Bearer token123");
    expect(result.data).to.deep.equal({ test: "data" });
    expect(result.params).to.deep.equal({ filter: "active" });
  });
});
