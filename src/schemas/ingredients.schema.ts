import { z } from "zod/v4";

export const createIngredientSchema = z.object({
  name: z.string().trim().min(2).max(80),
  description: z.string().trim().min(5).max(300),
  price: z.number().positive(),
  unit: z.string().trim().min(1).max(50),
});

export const updateIngredientSchema = createIngredientSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export const listIngredientsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  name: z.string().trim().min(1).optional(),
});

export type ListIngredientsQuery = z.infer<typeof listIngredientsQuerySchema>;

export type CreateIngredientInput = z.infer<typeof createIngredientSchema>;

export type UpdateIngredientInput = z.infer<typeof updateIngredientSchema>;
