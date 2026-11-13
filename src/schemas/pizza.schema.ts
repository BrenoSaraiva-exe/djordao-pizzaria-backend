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

export type CreatePizzaInput = z.infer<typeof createPizzaSchema>;

export type UpdatePizzaInput = z.infer<typeof updatePizzaSchema>;
