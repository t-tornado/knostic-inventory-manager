import { createAxiosApiClient } from "@/infrastructure/apiClient/axios/factory";
import { InterceptorFn } from "@/infrastructure/apiClient/base";
import type { InternalAxiosRequestConfig, AxiosResponse } from "axios";

type UnknownAxiosResponse = AxiosResponse<unknown, unknown, unknown>;

describe("createAxiosApiClient", () => {
  const baseURL = "http://localhost:3000/api/v1";

  it("should create an API client with correct base URL", () => {
    const client = createAxiosApiClient(baseURL);

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    expect(client).to.not.be.undefined;
    expect(typeof client.get).to.equal("function");
    expect(typeof client.post).to.equal("function");
    expect(typeof client.put).to.equal("function");
    expect(typeof client.delete).to.equal("function");
  });

  it("should make POST requests successfully", async () => {
    const requestData = { name: "New Item" };
    const responseData = { id: 1, ...requestData };
    cy.intercept("POST", `${baseURL}/test`, {
      statusCode: 200,
      body: responseData,
    }).as("postRequest");

    const client = createAxiosApiClient(baseURL);
    const result = (await client.post("/test", requestData)) as AxiosResponse<
      typeof responseData
    >;

    cy.wait("@postRequest");
    expect(result.data).to.deep.equal(responseData);
  });

  it("should make PUT requests successfully", async () => {
    const requestData = { name: "Updated Item" };
    const responseData = { id: 1, ...requestData };
    cy.intercept("PUT", `${baseURL}/test/1`, {
      statusCode: 200,
      body: responseData,
    }).as("putRequest");

    const client = createAxiosApiClient(baseURL);
    const result = (await client.put("/test/1", requestData)) as AxiosResponse<
      typeof responseData
    >;

    cy.wait("@putRequest");
    expect(result.data).to.deep.equal(responseData);
  });

  it("should make DELETE requests successfully", async () => {
    cy.intercept("DELETE", `${baseURL}/test/1`, {
      statusCode: 200,
      body: {},
    }).as("deleteRequest");

    const client = createAxiosApiClient(baseURL);
    const result = (await client.delete("/test/1")) as AxiosResponse<void>;
    cy.wait("@deleteRequest");
    expect(result.data).to.deep.equal({});
  });

  it("should apply request interceptor when provided", async () => {
    const requestInterceptor = (
      config: InternalAxiosRequestConfig
    ): InternalAxiosRequestConfig => {
      config.headers = config.headers || {};
      config.headers["X-Custom-Header"] = "test-value";
      return config;
    };

    cy.intercept("GET", `${baseURL}/test`, (req) => {
      expect(req.headers["x-custom-header"]).to.equal("test-value");
      req.reply({ statusCode: 200, body: { success: true } });
    }).as("getRequestWithHeader");

    const client = createAxiosApiClient(baseURL, requestInterceptor);
    await client.get("/test");

    cy.wait("@getRequestWithHeader");
  });

  it("should apply response interceptor when provided", async () => {
    const responseData = { data: { id: 1, name: "Test" } };
    const responseInterceptor = (response: unknown): unknown => {
      if (response && typeof response === "object" && "data" in response) {
        const axiosResponse = response as UnknownAxiosResponse;
        return axiosResponse.data;
      }
      return response;
    };

    cy.intercept("GET", `${baseURL}/test`, {
      statusCode: 200,
      body: responseData.data,
    }).as("getRequest");

    const client = createAxiosApiClient(
      baseURL,
      undefined,
      responseInterceptor as InterceptorFn<
        AxiosResponse<unknown, unknown, unknown>
      >
    );
    const result = await client.get("/test");

    cy.wait("@getRequest");
    expect(result).to.deep.equal(responseData.data);
  });

  it("should handle errors correctly", async () => {
    cy.intercept("GET", `${baseURL}/test`, {
      statusCode: 500,
      body: { error: "Internal Server Error" },
    }).as("getRequestError");

    const client = createAxiosApiClient(baseURL);

    try {
      await client.get("/test");
      throw new Error("Should have thrown an error");
    } catch (error) {
      expect(error).to.be.instanceOf(Error);
    }
  });
});
