function extractStringQueryParam(
  query: Record<string, unknown>,
  key: string
): string | undefined {
  const value = query[key];
  return typeof value === "string" ? value : undefined;
}

export function extractQueryParams(req: {
  query: Record<string, unknown>;
}): Record<string, string> {
  const queryParams: Record<string, string> = {};
  const search = extractStringQueryParam(req.query, "search");
  const filters = extractStringQueryParam(req.query, "filters");
  const sort = extractStringQueryParam(req.query, "sort");
  const page = extractStringQueryParam(req.query, "page");
  const pageSize = extractStringQueryParam(req.query, "pageSize");

  if (search !== undefined) queryParams.search = search;
  if (filters !== undefined) queryParams.filters = filters;
  if (sort !== undefined) queryParams.sort = sort;
  if (page !== undefined) queryParams.page = page;
  if (pageSize !== undefined) queryParams.pageSize = pageSize;

  return queryParams;
}
