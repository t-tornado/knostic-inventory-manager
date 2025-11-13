import type { Request, Response, NextFunction } from "express";
import type { ProductService } from "../../../application/services/ProductService";
import { successResponse } from "../types";
import {
  createValidationError,
  createNotFoundError,
} from "../../../domain/errors";
import { apiPath } from "../../../shared/config/apiVersion";
import "../middleware/shared/types"; // Import for Express type augmentation

export class ProductController {
  constructor(private productService: ProductService) {}

  async getAllProducts(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const path = apiPath("/products");
    try {
      const validatedParams = req.validatedTableQuery || {};

      if (
        !validatedParams.search &&
        !validatedParams.filters &&
        !validatedParams.sort &&
        !validatedParams.page &&
        !validatedParams.pageSize
      ) {
        const products = await this.productService.getAllProducts();
        const response = successResponse(products, path, "GET");
        res.status(200).json(response);
      } else {
        const result =
          await this.productService.getAllProductsWithParams(validatedParams);
        const response = successResponse(result, path, "GET");
        res.status(200).json(response);
      }
    } catch (error) {
      next(error);
    }
  }

  async getProductById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { id } = req.params;
    const path = apiPath(`/products/${id}`);

    if (!id) {
      throw createValidationError(
        "id",
        "MISSING_REQUIRED",
        "Product ID is required"
      ) as unknown as Error;
    }

    try {
      const product = await this.productService.getProductById(id);
      if (!product) {
        throw createNotFoundError(
          "id",
          "PRODUCT_NOT_FOUND",
          `Product with id '${id}' not found`
        ) as unknown as Error;
      }

      const response = successResponse(product, path, "GET");
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getProductsByStoreId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { storeId } = req.params;
    const path = apiPath(`/stores/${storeId}/products`);

    if (!storeId) {
      throw createValidationError(
        "storeId",
        "MISSING_REQUIRED",
        "Store ID is required"
      ) as unknown as Error;
    }

    try {
      const validatedParams = req.validatedTableQuery || {};

      if (
        !validatedParams.search &&
        !validatedParams.filters &&
        !validatedParams.sort &&
        !validatedParams.page &&
        !validatedParams.pageSize
      ) {
        const products =
          await this.productService.getProductsByStoreId(storeId);
        const response = successResponse(products, path, "GET");
        res.status(200).json(response);
      } else {
        const result = await this.productService.getProductsByStoreIdWithParams(
          storeId,
          validatedParams
        );
        const response = successResponse(result, path, "GET");
        res.status(200).json(response);
      }
    } catch (error) {
      next(error);
    }
  }

  async createProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const path = apiPath("/products");
    const validatedBody = req.validatedCreateProductBody;

    if (!validatedBody) {
      throw createValidationError(
        "body",
        "MISSING_REQUIRED",
        "Request body validation failed"
      ) as unknown as Error;
    }

    try {
      const product = await this.productService.createProduct({
        storeId: validatedBody.storeId,
        name: validatedBody.name,
        category: validatedBody.category,
        stockQuantity: validatedBody.stockQuantity,
        price: validatedBody.price,
      });
      const response = successResponse(product, path, "POST");
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async updateProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { id } = req.params;
    const path = apiPath(`/products/${id}`);

    if (!id) {
      throw createValidationError(
        "id",
        "MISSING_REQUIRED",
        "Product ID is required"
      ) as unknown as Error;
    }

    const validatedBody = req.validatedUpdateProductBody;

    if (!validatedBody) {
      throw createValidationError(
        "body",
        "MISSING_REQUIRED",
        "Request body validation failed"
      ) as unknown as Error;
    }

    try {
      const product = await this.productService.updateProduct(
        id,
        validatedBody
      );
      const response = successResponse(product, path, "PUT");
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async deleteProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { id } = req.params;

    if (!id) {
      throw createValidationError(
        "id",
        "MISSING_REQUIRED",
        "Product ID is required"
      ) as unknown as Error;
    }

    try {
      const deleted = await this.productService.deleteProduct(id);
      if (!deleted) {
        throw createNotFoundError(
          "id",
          "PRODUCT_NOT_FOUND",
          `Product with id '${id}' not found`
        ) as unknown as Error;
      }

      // 204 No Content - successful deletion with no response body
      res.status(204).send("");
    } catch (error) {
      next(error);
    }
  }
}
