import { TableQueryParams } from "../types";
import { TableQueryParamsSchema } from "../validators/tableQueryParamsSchema";

export function buildQueryParams(params?: TableQueryParams): URLSearchParams {
  const queryParams = new URLSearchParams();

  if (!params) {
    return queryParams;
  }

  const result = TableQueryParamsSchema.safeParse(params);

  if (!result.success) {
    const errors = result.error.issues
      .map((issue) => {
        const field = issue.path.join(".");
        return `${field}: ${issue.message}`;
      })
      .join(", ");
    throw new Error(`Invalid query parameters: ${errors}`);
  }

  const validated = result.data;

  if (validated.search) {
    queryParams.append("search", validated.search);
  }

  if (validated.filters) {
    queryParams.append("filters", validated.filters);
  }

  if (validated.page !== undefined) {
    queryParams.append("page", validated.page.toString());
  }

  if (validated.pageSize !== undefined) {
    queryParams.append("pageSize", validated.pageSize.toString());
  }

  return queryParams;
}
