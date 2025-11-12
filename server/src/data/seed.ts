import { createProductId, Product } from "../domain/entities/Product";
import { createStoreId, Store } from "../domain/entities/Store";
import { Price } from "../domain/entities/ValueObject";

export const seedStores: Omit<Store, "createdAt" | "updatedAt">[] = [
  {
    id: createStoreId("1"),
    name: "Main Store",
  },
  {
    id: createStoreId("2"),
    name: "Downtown Branch",
  },
  {
    id: createStoreId("3"),
    name: "Tech Hub",
  },
  {
    id: createStoreId("4"),
    name: "West Branch",
  },
  {
    id: createStoreId("5"),
    name: "East Branch",
  },
  {
    id: createStoreId("6"),
    name: "North Plaza",
  },
  {
    id: createStoreId("7"),
    name: "South Center",
  },
  {
    id: createStoreId("8"),
    name: "Central Mall",
  },
];

const productTemplates = [
  {
    suffix: "01",
    name: 'Laptop Pro 15"',
    category: "Electronics",
    baseStock: 22,
    basePrice: 1299.99,
  },
  {
    suffix: "02",
    name: "Wireless Mouse",
    category: "Accessories",
    baseStock: 40,
    basePrice: 29.99,
  },
  {
    suffix: "03",
    name: "USB-C Cable",
    category: "Cables",
    baseStock: 18,
    basePrice: 12.99,
  },
  {
    suffix: "04",
    name: "Gaming Keyboard",
    category: "Accessories",
    baseStock: 28,
    basePrice: 89.99,
  },
  {
    suffix: "05",
    name: 'Monitor 27" 4K',
    category: "Electronics",
    baseStock: 14,
    basePrice: 449.99,
  },
  {
    suffix: "06",
    name: "Webcam HD",
    category: "Accessories",
    baseStock: 24,
    basePrice: 79.99,
  },
  {
    suffix: "07",
    name: "SSD 1TB",
    category: "Hardware",
    baseStock: 34,
    basePrice: 129.99,
  },
  {
    suffix: "08",
    name: "RAM 16GB DDR4",
    category: "Hardware",
    baseStock: 38,
    basePrice: 89.99,
  },
] as const;

export function generateSeedProducts(
  stores: Omit<Store, "createdAt" | "updatedAt">[]
): Omit<Product, "createdAt" | "updatedAt">[] {
  const products: Omit<Product, "createdAt" | "updatedAt">[] = [];

  stores.forEach((store, storeIndex) => {
    productTemplates.forEach((template, templateIndex) => {
      const stockVariation =
        template.baseStock - storeIndex * 2 + templateIndex;
      const priceVariation = template.basePrice * (1 + storeIndex * 0.03);

      products.push({
        id: createProductId(`PRD-${store.id}${template.suffix}`),
        storeId: store.id,
        name: template.name,
        category: template.category,
        stockQuantity: Math.max(6, Math.round(stockVariation)),
        price: Number(priceVariation.toFixed(2)) as Price,
      });
    });
  });

  return products;
}
