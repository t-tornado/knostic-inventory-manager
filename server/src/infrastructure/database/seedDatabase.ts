import type { IDatabase } from "./IDatabase";
import type { IStoreRepository } from "../../domain/repositories/IStoreRepository";
import type { IProductRepository } from "../../domain/repositories/IProductRepository";
import { seedStores, generateSeedProducts } from "../../data/seed";

export async function seedDatabase(
  db: IDatabase,
  storeRepository: IStoreRepository,
  productRepository: IProductRepository
): Promise<void> {
  // Check if database is already seeded
  const existingStores = await storeRepository.findAll();
  if (existingStores.length > 0) {
    console.log("Database already contains data, skipping seed");
    return;
  }

  console.log("Seeding database...");

  // Seed stores
  for (const store of seedStores) {
    await storeRepository.create(store);
  }
  console.log(`Seeded ${seedStores.length} stores`);

  // Generate and seed products
  const products = generateSeedProducts(seedStores);
  for (const product of products) {
    await productRepository.create(product);
  }
  console.log(`Seeded ${products.length} products`);
}
