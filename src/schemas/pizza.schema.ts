import { z } from "zod/v4";

import {
  paginationQuerySchema,
  productFieldsSchema,
  updateSchema,
} from "./common.schema.js";

export const createPizzaSchema = productFieldsSchema.extend({
  categoryId: z.number().int().positive(),
});

export const updatePizzaSchema = updateSchema(createPizzaSchema);

export const listPizzasQuerySchema = paginationQuerySchema.extend({
  name: z.string().trim().min(1).optional(),
  categoryId: z.coerce.number().int().min(1).optional(),
  categoryName: z.string().trim().min(1).optional(),
});

export type ListPizzasQuery = z.infer<typeof listPizzasQuerySchema>;

export type CreatePizzaInput = z.infer<typeof createPizzaSchema>;

export type UpdatePizzaInput = z.infer<typeof updatePizzaSchema>;
