import type { IDatabase } from "./IDatabase";
import type { IStoreRepository } from "../../domain/repositories/IStoreRepository";
import type { IProductRepository } from "../../domain/repositories/IProductRepository";
import { seedStores, generateSeedProducts } from "../../data/seed";
import { Logger } from "../../shared/logger";

export async function seedDatabase(
  db: IDatabase,
  storeRepository: IStoreRepository,
  productRepository: IProductRepository
): Promise<void> {
  const existingStores = await storeRepository.findAll();
  if (existingStores.data.length > 0) {
    Logger.info("Database already contains data, skipping seed");
    return;
  }

  Logger.info("Seeding database...");

  const createdStores = [];
  for (const store of seedStores) {
    const createdStore = await storeRepository.create(store);
    createdStores.push(createdStore);
  }
  Logger.info(`Seeded ${createdStores.length} stores`, {
    storeCount: createdStores.length,
  });

  const products = generateSeedProducts(createdStores);
  for (const product of products) {
    await productRepository.create(product);
  }
  Logger.info(`Seeded ${products.length} products`, {
    productCount: products.length,
  });
}
