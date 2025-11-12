import { apiClient } from "@/infrastructure/apiClient";
import { createProductRepository } from "./repository";
import type {
  IProductService,
  IProductRepository,
  ProductQueryParams,
} from "./types";

export function createProductService(
  repository: IProductRepository
): IProductService {
  return {
    async getProducts(params?: ProductQueryParams) {
      return repository.getProducts(params);
    },
    async getProductById(id: string) {
      return repository.getProductById(id);
    },
    async createProduct(product) {
      return repository.createProduct(product);
    },
    async updateProduct(id, product) {
      return repository.updateProduct(id, product);
    },
    async deleteProduct(id) {
      return repository.deleteProduct(id);
    },
  };
}

export const productService = createProductService(
  createProductRepository(apiClient)
);
