import type { IDatabase } from "./IDatabase";
import type { IStoreRepository } from "../../domain/repositories/IStoreRepository";
import type { IProductRepository } from "../../domain/repositories/IProductRepository";
import { seedStores, generateSeedProducts } from "../../data/seed";

export async function seedDatabase(
  db: IDatabase,
  storeRepository: IStoreRepository,
  productRepository: IProductRepository
): Promise<void> {
  const existingStores = await storeRepository.findAll();
  if (existingStores.data.length > 0) {
    console.log("Database already contains data, skipping seed");
    return;
  }

  console.log("Seeding database...");

  // Seed stores and collect created stores with IDs
  const createdStores = [];
  for (const store of seedStores) {
    const createdStore = await storeRepository.create(store);
    createdStores.push(createdStore);
  }
  console.log(`Seeded ${createdStores.length} stores`);

  // Generate and seed products using created stores with IDs
  const products = generateSeedProducts(createdStores);
  for (const product of products) {
    await productRepository.create(product);
  }
  console.log(`Seeded ${products.length} products`);
}
