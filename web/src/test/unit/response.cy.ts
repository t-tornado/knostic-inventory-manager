import { responseInterceptor } from "@/infrastructure/apiClient/interceptors/response";
import type { AxiosResponse } from "axios";

describe("responseInterceptor", () => {
  it("should return response unchanged", () => {
    const mockData = { id: 1, name: "Test" };
    const response: AxiosResponse<typeof mockData> = {
      data: mockData,
      status: 200,
      statusText: "OK",
      headers: {},
      config: {} as unknown,
    } as AxiosResponse<typeof mockData>;

    const result = responseInterceptor(response);

    expect(result).to.deep.equal(response);
    expect(result.data).to.deep.equal(mockData);
  });

  it("should handle null data", () => {
    const response: AxiosResponse<null> = {
      data: null,
      status: 200,
      statusText: "OK",
      headers: {},
      config: {} as unknown,
    } as AxiosResponse<null>;

    const result = responseInterceptor(response);

    expect(result).to.deep.equal(response);
  });

  it("should handle array data", () => {
    const mockData = [{ id: 1 }, { id: 2 }];
    const response: AxiosResponse<typeof mockData> = {
      data: mockData,
      status: 200,
      statusText: "OK",
      headers: {},
      config: {} as unknown,
    } as AxiosResponse<typeof mockData>;

    const result = responseInterceptor(response);

    expect(result).to.deep.equal(response);
    expect(result.data).to.deep.equal(mockData);
    if (Array.isArray(result.data)) {
      expect(result.data).to.have.length(2);
      expect(result.data[0]).to.have.property("id", 1);
    }
  });

  it("should handle nested data structures", () => {
    const mockData = {
      user: {
        id: 1,
        name: "John",
        settings: {
          theme: "dark",
        },
      },
    };
    const response: AxiosResponse<typeof mockData> = {
      data: mockData,
      status: 200,
      statusText: "OK",
      headers: {},
      config: {} as unknown,
    } as AxiosResponse<typeof mockData>;

    const result = responseInterceptor(response);

    expect(result).to.deep.equal(response);
    expect(result.data).to.deep.equal(mockData);
    if (
      result.data &&
      typeof result.data === "object" &&
      "user" in result.data
    ) {
      expect(result.data.user.name).to.equal("John");
      expect(result.data.user.settings.theme).to.equal("dark");
    }
  });
});
