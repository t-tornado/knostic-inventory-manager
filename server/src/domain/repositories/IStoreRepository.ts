import type { Store, StoreId } from "../entities/Store";

export interface IStoreRepository {
  findAll(): Promise<Store[]>;
  findById(id: StoreId): Promise<Store | null>;
  create(store: Omit<Store, "createdAt" | "updatedAt">): Promise<Store>;
  update(
    id: StoreId,
    store: Partial<Omit<Store, "id" | "createdAt">>
  ): Promise<Store>;
  delete(id: StoreId): Promise<boolean>;
}
