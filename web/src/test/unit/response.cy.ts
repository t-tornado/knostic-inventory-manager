import { responseInterceptor } from "@/infrastructure/apiClient/axios/interceptors/response";
import type { AxiosResponse } from "axios";

describe("responseInterceptor", () => {
  it("should extract data from response", () => {
    const mockData = { id: 1, name: "Test" };
    const response: AxiosResponse<typeof mockData> = {
      data: mockData,
      status: 200,
      statusText: "OK",
      headers: {},
      config: {} as unknown,
    } as AxiosResponse<typeof mockData>;

    const result = responseInterceptor(response);

    expect(result).to.deep.equal(mockData);
    expect(result).to.have.property("id", 1);
    expect(result).to.have.property("name", "Test");
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

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    expect(result).to.be.null;
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

    expect(result).to.deep.equal(mockData);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    expect(Array.isArray(result)).to.be.true;
    if (Array.isArray(result)) {
      expect(result).to.have.length(2);
      expect(result[0]).to.have.property("id", 1);
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

    expect(result).to.deep.equal(mockData);
    if (result && typeof result === "object" && "user" in result) {
      expect((result as typeof mockData).user.name).to.equal("John");
      expect((result as typeof mockData).user.settings.theme).to.equal("dark");
    }
  });
});
