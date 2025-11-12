import type { IHttpRequest, IHttpResponse } from "../IHttpServer";
import type { ProductService } from "../../../application/services/ProductService";
import { successResponse, errorResponse } from "../types";
import {
  createValidationError,
  createNotFoundError,
  createInternalServerError,
} from "../../../domain/errors";

export class ProductController {
  constructor(private productService: ProductService) {}

  async getAllProducts(req: IHttpRequest, res: IHttpResponse): Promise<void> {
    const path = "/api/products";
    try {
      const products = await this.productService.getAllProducts();
      const response = successResponse(products, path, "GET");
      res.status(200).json(response);
    } catch (error) {
      const response = errorResponse(
        [
          createInternalServerError(
            "products",
            "FETCH_ERROR",
            "Failed to fetch products"
          ),
        ],
        path,
        "GET"
      );
      res.status(500).json(response);
    }
  }

  async getProductById(req: IHttpRequest, res: IHttpResponse): Promise<void> {
    const { id } = req.params;
    const path = `/api/products/${id}`;

    if (!id) {
      const response = errorResponse(
        [
          createValidationError(
            "id",
            "MISSING_REQUIRED",
            "Product ID is required"
          ),
        ],
        path,
        "GET"
      );
      res.status(400).json(response);
      return;
    }

    try {
      const product = await this.productService.getProductById(id);
      if (!product) {
        const response = errorResponse(
          [
            createNotFoundError(
              "id",
              "PRODUCT_NOT_FOUND",
              `Product with id '${id}' not found`
            ),
          ],
          path,
          "GET"
        );
        res.status(404).json(response);
        return;
      }

      const response = successResponse(product, path, "GET");
      res.status(200).json(response);
    } catch (error) {
      const response = errorResponse(
        [
          createInternalServerError(
            "product",
            "FETCH_ERROR",
            "Failed to fetch product"
          ),
        ],
        path,
        "GET"
      );
      res.status(500).json(response);
    }
  }

  async getProductsByStoreId(
    req: IHttpRequest,
    res: IHttpResponse
  ): Promise<void> {
    const { storeId } = req.params;
    const path = `/api/stores/${storeId}/products`;

    if (!storeId) {
      const response = errorResponse(
        [
          createValidationError(
            "storeId",
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
      const products = await this.productService.getProductsByStoreId(storeId);
      const response = successResponse(products, path, "GET");
      res.status(200).json(response);
    } catch (error) {
      const response = errorResponse(
        [
          createInternalServerError(
            "products",
            "FETCH_ERROR",
            "Failed to fetch products for store"
          ),
        ],
        path,
        "GET"
      );
      res.status(500).json(response);
    }
  }

  async createProduct(req: IHttpRequest, res: IHttpResponse): Promise<void> {
    const path = "/api/products";
    const body = req.body as {
      storeId?: string;
      name?: string;
      category?: string;
      stockQuantity?: number;
      price?: number;
    };

    const errors = [];
    if (!body.storeId) {
      errors.push(
        createValidationError(
          "storeId",
          "MISSING_REQUIRED",
          "storeId is required"
        )
      );
    }
    if (
      !body.name ||
      typeof body.name !== "string" ||
      body.name.trim().length === 0
    ) {
      errors.push(
        createValidationError("name", "MISSING_REQUIRED", "name is required")
      );
    }
    if (
      !body.category ||
      typeof body.category !== "string" ||
      body.category.trim().length === 0
    ) {
      errors.push(
        createValidationError(
          "category",
          "MISSING_REQUIRED",
          "category is required"
        )
      );
    }
    if (typeof body.stockQuantity !== "number") {
      errors.push(
        createValidationError(
          "stockQuantity",
          "INVALID_TYPE",
          "stockQuantity must be a number"
        )
      );
    }
    if (typeof body.price !== "number") {
      errors.push(
        createValidationError("price", "INVALID_TYPE", "price must be a number")
      );
    }

    if (errors.length > 0) {
      const response = errorResponse(errors, path, "POST");
      res.status(400).json(response);
      return;
    }

    try {
      const product = await this.productService.createProduct({
        storeId: body.storeId!,
        name: body.name!,
        category: body.category!,
        stockQuantity: body.stockQuantity!,
        price: body.price!,
      });
      const response = successResponse(product, path, "POST");
      res.status(201).json(response);
    } catch (error) {
      const response = errorResponse(
        [
          createInternalServerError(
            "product",
            "CREATE_ERROR",
            "Failed to create product"
          ),
        ],
        path,
        "POST"
      );
      res.status(500).json(response);
    }
  }

  async updateProduct(req: IHttpRequest, res: IHttpResponse): Promise<void> {
    const { id } = req.params;
    const path = `/api/products/${id}`;
    const body = req.body as {
      storeId?: string;
      name?: string;
      category?: string;
      stockQuantity?: number;
      price?: number;
    };

    const errors = [];
    if (!id) {
      errors.push(
        createValidationError(
          "id",
          "MISSING_REQUIRED",
          "Product ID is required"
        )
      );
    }
    if (
      body.stockQuantity !== undefined &&
      typeof body.stockQuantity !== "number"
    ) {
      errors.push(
        createValidationError(
          "stockQuantity",
          "INVALID_TYPE",
          "stockQuantity must be a number"
        )
      );
    }
    if (body.price !== undefined && typeof body.price !== "number") {
      errors.push(
        createValidationError("price", "INVALID_TYPE", "price must be a number")
      );
    }

    if (errors.length > 0) {
      const response = errorResponse(errors, path, "PUT");
      res.status(400).json(response);
      return;
    }

    try {
      const product = await this.productService.updateProduct(id!, body);
      const response = successResponse(product, path, "PUT");
      res.status(200).json(response);
    } catch (error) {
      const response = errorResponse(
        [
          createNotFoundError(
            "id",
            "PRODUCT_NOT_FOUND",
            `Product with id '${id}' not found`
          ),
        ],
        path,
        "PUT"
      );
      res.status(404).json(response);
    }
  }

  async deleteProduct(req: IHttpRequest, res: IHttpResponse): Promise<void> {
    const { id } = req.params;
    const path = `/api/products/${id}`;

    if (!id) {
      const response = errorResponse(
        [
          createValidationError(
            "id",
            "MISSING_REQUIRED",
            "Product ID is required"
          ),
        ],
        path,
        "DELETE"
      );
      res.status(400).json(response);
      return;
    }

    try {
      const deleted = await this.productService.deleteProduct(id);
      if (!deleted) {
        const response = errorResponse(
          [
            createNotFoundError(
              "id",
              "PRODUCT_NOT_FOUND",
              `Product with id '${id}' not found`
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
            "product",
            "DELETE_ERROR",
            "Failed to delete product"
          ),
        ],
        path,
        "DELETE"
      );
      res.status(500).json(response);
    }
  }
}
