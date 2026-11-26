import { z } from "zod/v4";

import {
  paginationQuerySchema,
  productFieldsSchema,
  updateSchema,
} from "./common.schema.js";

export const createIngredientSchema = productFieldsSchema.extend({
  unit: z.string().trim().min(1).max(50),
});

export const updateIngredientSchema = updateSchema(createIngredientSchema);

export const listIngredientsQuerySchema = paginationQuerySchema.extend({
  name: z.string().trim().min(1).optional(),
});

export type ListIngredientsQuery = z.infer<typeof listIngredientsQuerySchema>;

export type CreateIngredientInput = z.infer<typeof createIngredientSchema>;

export type UpdateIngredientInput = z.infer<typeof updateIngredientSchema>;
