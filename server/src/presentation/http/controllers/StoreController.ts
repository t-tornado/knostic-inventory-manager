import type { Request, Response, NextFunction } from "express";
import type { StoreService } from "../../../application/services/StoreService";
import { successResponse } from "../types";
import {
  createValidationError,
  createNotFoundError,
} from "../../../domain/errors";
import { apiPath } from "../../../shared/config/apiVersion";
import "../middleware/shared/types"; // Import for Express type augmentation

export class StoreController {
  constructor(private storeService: StoreService) {}

  async getAllStores(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const path = apiPath("/stores");
    try {
      const validatedParams = req.validatedTableQuery || {};
      const result = await this.storeService.getAllStores(validatedParams);
      const response = successResponse(result, path, "GET");
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getStoreById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { id } = req.params;
    const path = apiPath(`/stores/${id}`);

    if (!id) {
      throw createValidationError(
        "id",
        "MISSING_REQUIRED",
        "Store ID is required"
      ) as unknown as Error;
    }

    try {
      const store = await this.storeService.getStoreById(id);
      if (!store) {
        throw createNotFoundError(
          "id",
          "STORE_NOT_FOUND",
          `Store with id '${id}' not found`
        ) as unknown as Error;
      }

      const response = successResponse(store, path, "GET");
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getStoreDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { id } = req.params;
    const path = apiPath(`/stores/${id}/details`);

    if (!id) {
      throw createValidationError(
        "id",
        "MISSING_REQUIRED",
        "Store ID is required"
      ) as unknown as Error;
    }

    try {
      const storeDetails = await this.storeService.getStoreDetails(id);
      if (!storeDetails) {
        throw createNotFoundError(
          "id",
          "STORE_NOT_FOUND",
          `Store with id '${id}' not found`
        ) as unknown as Error;
      }

      const response = successResponse(storeDetails, path, "GET");
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async createStore(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const path = apiPath("/stores");
    const validatedBody = req.validatedCreateStoreBody;

    if (!validatedBody) {
      throw createValidationError(
        "body",
        "MISSING_REQUIRED",
        "Request body validation failed"
      ) as unknown as Error;
    }

    try {
      const store = await this.storeService.createStore({
        name: validatedBody.name,
      });
      const response = successResponse(store, path, "POST");
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async updateStore(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { id } = req.params;
    const path = apiPath(`/stores/${id}`);

    if (!id) {
      throw createValidationError(
        "id",
        "MISSING_REQUIRED",
        "Store ID is required"
      ) as unknown as Error;
    }

    const validatedBody = req.validatedUpdateStoreBody;

    if (!validatedBody) {
      throw createValidationError(
        "body",
        "MISSING_REQUIRED",
        "Request body validation failed"
      ) as unknown as Error;
    }

    try {
      const store = await this.storeService.updateStore(id, validatedBody);
      const response = successResponse(store, path, "PUT");
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async deleteStore(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { id } = req.params;

    if (!id) {
      throw createValidationError(
        "id",
        "MISSING_REQUIRED",
        "Store ID is required"
      ) as unknown as Error;
    }

    try {
      const deleted = await this.storeService.deleteStore(id);
      if (!deleted) {
        throw createNotFoundError(
          "id",
          "STORE_NOT_FOUND",
          `Store with id '${id}' not found`
        ) as unknown as Error;
      }

      // 204 No Content - successful deletion with no response body
      res.status(204).send("");
    } catch (error) {
      next(error);
    }
  }
}
