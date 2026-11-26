import type { PaginationQuery } from "../schemas/common.schema.js";

export function getPagination(query: PaginationQuery) {
  return {
    page: query.page,
    limit: query.limit,
    offset: (query.page - 1) * query.limit,
  };
}

export function getPaginationMeta(total: number, page: number, limit: number) {
  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}
