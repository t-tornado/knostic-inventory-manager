import type { Request } from "express";
import type { ValidatedCreateStoreBody } from "../validateCreateStore";
import type { ValidatedUpdateStoreBody } from "../validateUpdateStore";
import type { ValidatedCreateProductBody } from "../validateCreateProduct";
import type { ValidatedUpdateProductBody } from "../validateUpdateProduct";
import type {
  ValidatedDashboardQueryParams,
  ValidatedActivityQueryParams,
} from "../validateDashboardQuery";
import { ValidatedTableQueryParams } from "../../types";

declare global {
  namespace Express {
    interface Request {
      validatedTableQuery?: ValidatedTableQueryParams;
      validatedCreateStoreBody?: ValidatedCreateStoreBody;
      validatedUpdateStoreBody?: ValidatedUpdateStoreBody;
      validatedCreateProductBody?: ValidatedCreateProductBody;
      validatedUpdateProductBody?: ValidatedUpdateProductBody;
      validatedDashboardQuery?: ValidatedDashboardQueryParams;
      validatedActivityQuery?: ValidatedActivityQueryParams;
    }
  }
}

export type { Request };
