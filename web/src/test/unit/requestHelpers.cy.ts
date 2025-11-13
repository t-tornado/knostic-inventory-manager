import {
  buildUrl,
  getRequest,
  postRequest,
  putRequest,
  deleteRequest,
} from "@/infrastructure/apiClient/requestHelpers";
import type { IApiClient } from "@/infrastructure/apiClient";
import type { ApiResponse } from "@/shared/api";

describe("requestHelpers", () => {
  describe("buildUrl", () => {
    it("should return path without query params when none provided", () => {
      const result = buildUrl("/dashboard");
      expect(result).to.equal("/dashboard");
    });

    it("should append query params when provided", () => {
      const params = new URLSearchParams({ filter: "active", page: "1" });
      const result = buildUrl("/dashboard", params);
      expect(result).to.equal("/dashboard?filter=active&page=1");
    });

    it("should handle empty query params", () => {
      const params = new URLSearchParams();
      const result = buildUrl("/dashboard", params);
      expect(result).to.equal("/dashboard");
    });

    it("should handle special characters in query params", () => {
      const params = new URLSearchParams({ search: "test&value" });
      const result = buildUrl("/search", params);
      expect(result).to.include("search=test%26value");
    });
  });

  describe("getRequest", () => {
    it("should return data when response is successful", async () => {
      const mockData = { id: 1, name: "Test" };
      const getStub = cy.stub().resolves({
        data: { data: mockData } as ApiResponse<typeof mockData>,
      });
      const mockClient = {
        get: getStub,
        post: cy.stub(),
        put: cy.stub(),
        delete: cy.stub(),
      } as unknown as IApiClient;

      const result = await getRequest(
        mockClient,
        "/test",
        "Default error message"
      );

      expect(result).to.deep.equal(mockData);
      expect(getStub).to.have.been.calledWith("/test");
    });

    it("should throw error when response has errors", async () => {
      const getStub = cy.stub().resolves({
        data: {
          errors: [
            {
              type: "ValidationError",
              field: "name",
              code: "REQUIRED",
              message: "Name is required",
            },
          ],
        } as ApiResponse,
      });
      const mockClient = {
        get: getStub,
        post: cy.stub(),
        put: cy.stub(),
        delete: cy.stub(),
      } as unknown as IApiClient;

      try {
        await getRequest(mockClient, "/test", "Default error message");
        expect.fail("Should have thrown an error");
      } catch (error: unknown) {
        expect((error as Error).message).to.equal("Name is required");
      }
    });

    it("should throw default error message when no data and no errors", async () => {
      const getStub = cy.stub().resolves({
        data: {
          data: undefined,
        } as ApiResponse,
      });
      const mockClient = {
        get: getStub,
        post: cy.stub(),
        put: cy.stub(),
        delete: cy.stub(),
      } as unknown as IApiClient;

      try {
        await getRequest(mockClient, "/test", "Default error message");
        expect.fail("Should have thrown an error");
      } catch (error: unknown) {
        expect((error as Error).message).to.equal("Default error message");
      }
    });

    it("should handle multiple errors", async () => {
      const getStub = cy.stub().resolves({
        data: {
          errors: [
            {
              type: "ValidationError",
              field: "name",
              code: "REQUIRED",
              message: "Name is required",
            },
            {
              type: "ValidationError",
              field: "email",
              code: "INVALID",
              message: "Email is invalid",
            },
          ],
        } as ApiResponse,
      });
      const mockClient = {
        get: getStub,
        post: cy.stub(),
        put: cy.stub(),
        delete: cy.stub(),
      } as unknown as IApiClient;

      try {
        await getRequest(mockClient, "/test", "Default error message");
        expect.fail("Should have thrown an error");
      } catch (error: unknown) {
        expect((error as Error).message).to.equal(
          "Name is required, Email is invalid"
        );
      }
    });
  });

  describe("postRequest", () => {
    it("should return data when response is successful", async () => {
      const requestData = { name: "New Item" };
      const responseData = { id: 1, ...requestData };
      const postStub = cy.stub().resolves({
        data: { data: responseData } as ApiResponse<typeof responseData>,
      });
      const mockClient = {
        get: cy.stub(),
        post: postStub,
        put: cy.stub(),
        delete: cy.stub(),
      } as unknown as IApiClient;

      const result = await postRequest(
        mockClient,
        "/test",
        requestData,
        "Default error message"
      );

      expect(result).to.deep.equal(responseData);
      expect(postStub).to.have.been.calledWith("/test", requestData);
    });

    it("should throw error when response has errors", async () => {
      const postStub = cy.stub().resolves({
        data: {
          errors: [
            {
              type: "ValidationError",
              field: "name",
              code: "REQUIRED",
              message: "Name is required",
            },
          ],
        } as ApiResponse,
      });
      const mockClient = {
        get: cy.stub(),
        post: postStub,
        put: cy.stub(),
        delete: cy.stub(),
      } as unknown as IApiClient;

      try {
        await postRequest(
          mockClient,
          "/test",
          { name: "" },
          "Default error message"
        );
        expect.fail("Should have thrown an error");
      } catch (error: unknown) {
        expect((error as Error).message).to.equal("Name is required");
      }
    });
  });

  describe("putRequest", () => {
    it("should return data when response is successful", async () => {
      const requestData = { name: "Updated Item" };
      const responseData = { id: 1, ...requestData };
      const putStub = cy.stub().resolves({
        data: { data: responseData } as ApiResponse<typeof responseData>,
      });
      const mockClient = {
        get: cy.stub(),
        post: cy.stub(),
        put: putStub,
        delete: cy.stub(),
      } as unknown as IApiClient;

      const result = await putRequest(
        mockClient,
        "/test/1",
        requestData,
        "Default error message"
      );

      expect(result).to.deep.equal(responseData);
      expect(putStub).to.have.been.calledWith("/test/1", requestData);
    });

    it("should throw error when response has errors", async () => {
      const putStub = cy.stub().resolves({
        data: {
          errors: [
            {
              type: "NotFoundError",
              field: "id",
              code: "NOT_FOUND",
              message: "Resource not found",
            },
          ],
        } as ApiResponse,
      });
      const mockClient = {
        get: cy.stub(),
        post: cy.stub(),
        put: putStub,
        delete: cy.stub(),
      } as unknown as IApiClient;

      try {
        await putRequest(
          mockClient,
          "/test/999",
          { name: "Test" },
          "Default error message"
        );
        expect.fail("Should have thrown an error");
      } catch (error: unknown) {
        expect((error as Error).message).to.equal("Resource not found");
      }
    });
  });

  describe("deleteRequest", () => {
    it("should throw error when response has errors", async () => {
      const deleteStub = cy.stub().resolves({
        data: {
          errors: [
            {
              type: "NotFoundError",
              field: "id",
              code: "NOT_FOUND",
              message: "Resource not found",
            },
          ],
        } as ApiResponse,
      });
      const mockClient = {
        get: cy.stub(),
        post: cy.stub(),
        put: cy.stub(),
        delete: deleteStub,
      } as unknown as IApiClient;

      try {
        await deleteRequest(mockClient, "/test/999", "Default error message");
        expect.fail("Should have thrown an error");
      } catch (error: unknown) {
        expect((error as Error).message).to.equal("Resource not found");
      }
    });
  });
});
