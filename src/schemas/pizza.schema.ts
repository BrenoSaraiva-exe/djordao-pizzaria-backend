import { z } from "zod/v4";

export const createPizzaSchema = z.object({
  name: z.string().trim().min(2).max(80),
  description: z.string().trim().min(5).max(300),
  price: z.number().positive(),
});

export const updatePizzaSchema = createPizzaSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export const listPizzasQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  name: z.string().trim().min(1).optional(),
});

export type ListPizzasQuery = z.infer<typeof listPizzasQuerySchema>;

export type CreatePizzaInput = z.infer<typeof createPizzaSchema>;

export type UpdatePizzaInput = z.infer<typeof updatePizzaSchema>;
