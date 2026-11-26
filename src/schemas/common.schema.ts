import { z } from "zod/v4";

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export type PaginationQuery = z.infer<typeof paginationQuerySchema>;

export const idParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const productFieldsSchema = z.object({
  name: z.string().trim().min(2).max(80),
  description: z.string().trim().min(5).max(300),
  price: z.number().positive(),
});

export function updateSchema<T extends z.ZodObject>(schema: T) {
  return schema.partial().refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });
}
