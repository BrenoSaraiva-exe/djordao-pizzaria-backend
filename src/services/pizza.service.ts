import { asc, eq, ilike, count } from "drizzle-orm";

import { db } from "../db/index.js";
import { pizzas } from "../db/schema/pizzas.js";
import type {
  CreatePizzaInput,
  ListPizzasQuery,
  UpdatePizzaInput,
} from "../schemas/pizza.schema.js";

export async function getAllPizzas(query: ListPizzasQuery) {
  const page = query.page;
  const offset = (page - 1) * query.limit;
  const limit = query.limit;

  const filters = query.name
    ? ilike(pizzas.name, `%${query.name}%`)
    : undefined;

  const [result] = await db
    .select({ count: count() })
    .from(pizzas)
    .where(filters);
  const total = Number(result?.count ?? 0);
  const totalPages = Math.ceil(total / limit);

  const meta = { total, page, limit, totalPages };

  const data = await db
    .select()
    .from(pizzas)
    .where(filters)
    .orderBy(asc(pizzas.id))
    .limit(limit)
    .offset(offset);

  return { data, meta };
}

export async function getPizzaById(id: number) {
  const [pizza] = await db.select().from(pizzas).where(eq(pizzas.id, id));

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

export async function patchPizza(id: number, input: UpdatePizzaInput) {
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
  const [pizza] = await db.delete(pizzas).where(eq(pizzas.id, id)).returning();

  return pizza;
}
