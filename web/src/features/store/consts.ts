import { TableSchema } from "@/shared/components/BusinessTable";

/**
 * using this structure so that we can move this to the server some time to return possible values for each field
 */
export const STORES_TABLE_SCHEMA: TableSchema = {
  stores: {
    id: {
      value_types: ["string"],
      values: [],
    },
    name: {
      value_types: ["string"],
      values: [],
    },
    createdAt: {
      value_types: ["date"],
      values: [],
    },
    updatedAt: {
      value_types: ["date"],
      values: [],
    },
  },
};
