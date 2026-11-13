import { eq } from "drizzle-orm";

import { db } from "../db/index.js";
import { pizzas } from "../db/schema/pizzas.js";
import type {
  CreatePizzaInput,
  UpdatePizzaInput,
} from "../schemas/pizza.schema.js";

export async function getAllPizzas() {
  return db.select().from(pizzas);
}

export async function getPizzaById(id: number) {
  const [pizza] = await db
    .select()
    .from(pizzas)
    .where(eq(pizzas.id, id));

  return pizza;
}

export async function createPizza(input: CreatePizzaInput) {
  const [pizza] = await db
    .insert(pizzas)
    .values({
      ...input,
      price: input.price.toString(),
    })
    .returning();

  return pizza;
}

export async function patchPizza(
  id: number,
  input: UpdatePizzaInput,
) {
  const [pizza] = await db
    .update(pizzas)
    .set({
      ...input,
      price: input.price?.toString(),
      updatedAt: new Date(),
    })
    .where(eq(pizzas.id, id))
    .returning();

  return pizza;
}

export async function deletePizza(id: number) {
  const [pizza] = await db
    .delete(pizzas)
    .where(eq(pizzas.id, id))
    .returning();

  return pizza;
}
