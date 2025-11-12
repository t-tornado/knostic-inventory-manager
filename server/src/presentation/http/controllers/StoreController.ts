import type { IHttpRequest, IHttpResponse } from "../IHttpServer";
import type { StoreService } from "../../../application/services/StoreService";
import { successResponse, errorResponse } from "../types";
import {
  createValidationError,
  createNotFoundError,
  createInternalServerError,
} from "../../../domain/errors";

export class StoreController {
  constructor(private storeService: StoreService) {}

  async getAllStores(req: IHttpRequest, res: IHttpResponse): Promise<void> {
    const path = "/api/stores";
    try {
      const stores = await this.storeService.getAllStores();
      const response = successResponse(stores, path, "GET");
      res.status(200).json(response);
    } catch (error) {
      const response = errorResponse(
        [
          createInternalServerError(
            "stores",
            "FETCH_ERROR",
            "Failed to fetch stores"
          ),
        ],
        path,
        "GET"
      );
      res.status(500).json(response);
    }
  }

  async getStoreById(req: IHttpRequest, res: IHttpResponse): Promise<void> {
    const { id } = req.params;
    const path = `/api/stores/${id}`;

    if (!id) {
      const response = errorResponse(
        [
          createValidationError(
            "id",
            "MISSING_REQUIRED",
            "Store ID is required"
          ),
        ],
        path,
        "GET"
      );
      res.status(400).json(response);
      return;
    }

    try {
      const store = await this.storeService.getStoreById(id);
      if (!store) {
        const response = errorResponse(
          [
            createNotFoundError(
              "id",
              "STORE_NOT_FOUND",
              `Store with id '${id}' not found`
            ),
          ],
          path,
          "GET"
        );
        res.status(404).json(response);
        return;
      }

      const response = successResponse(store, path, "GET");
      res.status(200).json(response);
    } catch (error) {
      const response = errorResponse(
        [
          createInternalServerError(
            "store",
            "FETCH_ERROR",
            "Failed to fetch store"
          ),
        ],
        path,
        "GET"
      );
      res.status(500).json(response);
    }
  }

  async createStore(req: IHttpRequest, res: IHttpResponse): Promise<void> {
    const path = "/api/stores";
    const { name } = req.body as { name?: string };

    const errors = [];
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      errors.push(
        createValidationError(
          "name",
          "MISSING_REQUIRED",
          "Store name is required and cannot be empty"
        )
      );
    }

    if (errors.length > 0) {
      const response = errorResponse(errors, path, "POST");
      res.status(400).json(response);
      return;
    }

    try {
      const store = await this.storeService.createStore({ name: name! });
      const response = successResponse(store, path, "POST");
      res.status(201).json(response);
    } catch (error) {
      const response = errorResponse(
        [
          createInternalServerError(
            "store",
            "CREATE_ERROR",
            "Failed to create store"
          ),
        ],
        path,
        "POST"
      );
      res.status(500).json(response);
    }
  }

  async updateStore(req: IHttpRequest, res: IHttpResponse): Promise<void> {
    const { id } = req.params;
    const path = `/api/stores/${id}`;
    const { name } = req.body as { name?: string };

    const errors = [];
    if (!id) {
      errors.push(
        createValidationError("id", "MISSING_REQUIRED", "Store ID is required")
      );
    }

    if (
      name !== undefined &&
      (typeof name !== "string" || name.trim().length === 0)
    ) {
      errors.push(
        createValidationError(
          "name",
          "INVALID_VALUE",
          "Store name cannot be empty"
        )
      );
    }

    if (errors.length > 0) {
      const response = errorResponse(errors, path, "PUT");
      res.status(400).json(response);
      return;
    }

    try {
      const updateData: { name?: string } = {};
      if (name !== undefined) {
        updateData.name = name;
      }
      const store = await this.storeService.updateStore(id!, updateData);
      const response = successResponse(store, path, "PUT");
      res.status(200).json(response);
    } catch (error) {
      const response = errorResponse(
        [
          createNotFoundError(
            "id",
            "STORE_NOT_FOUND",
            `Store with id '${id}' not found`
          ),
        ],
        path,
        "PUT"
      );
      res.status(404).json(response);
    }
  }

  async deleteStore(req: IHttpRequest, res: IHttpResponse): Promise<void> {
    const { id } = req.params;
    const path = `/api/stores/${id}`;

    if (!id) {
      const response = errorResponse(
        [
          createValidationError(
            "id",
            "MISSING_REQUIRED",
            "Store ID is required"
          ),
        ],
        path,
        "DELETE"
      );
      res.status(400).json(response);
      return;
    }

    try {
      const deleted = await this.storeService.deleteStore(id);
      if (!deleted) {
        const response = errorResponse(
          [
            createNotFoundError(
              "id",
              "STORE_NOT_FOUND",
              `Store with id '${id}' not found`
            ),
          ],
          path,
          "DELETE"
        );
        res.status(404).json(response);
        return;
      }

      // 204 No Content - successful deletion with no response body
      res.status(204).send("");
    } catch (error) {
      const response = errorResponse(
        [
          createInternalServerError(
            "store",
            "DELETE_ERROR",
            "Failed to delete store"
          ),
        ],
        path,
        "DELETE"
      );
      res.status(500).json(response);
    }
  }
}
