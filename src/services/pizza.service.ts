import { asc, eq, ilike, count, and } from "drizzle-orm";

import { db } from "../db/index.js";
import { pizzas } from "../db/schema/pizzas.js";
import { categories } from "../db/schema/categories.js";
import type {
  CreatePizzaInput,
  ListPizzasQuery,
  UpdatePizzaInput,
} from "../schemas/pizza.schema.js";
import { pizzaDetails } from "../db/schema/pizza-details.js";
import { getPagination, getPaginationMeta } from "../utils/pagination.js";

export async function getAllPizzas(query: ListPizzasQuery) {
  const { page, limit, offset } = getPagination(query);

  const conditions = [];

  if (query.name) {
    conditions.push(ilike(pizzas.name, `%${query.name}%`));
  }

  if (query.categoryId) {
    conditions.push(eq(pizzas.categoryId, query.categoryId));
  }

  if (query.categoryName) {
    conditions.push(ilike(categories.name, `%${query.categoryName}%`));
  }

  const filters = conditions.length > 0 ? and(...conditions) : undefined;

  const [result] = await db
    .select({ count: count() })
    .from(pizzas)
    .innerJoin(categories, eq(pizzas.categoryId, categories.id))
    .where(filters);
  const total = Number(result?.count ?? 0);
  const meta = getPaginationMeta(total, page, limit);

  const data = await db
    .select({
      id: pizzas.id,
      name: pizzas.name,
      description: pizzas.description,
      price: pizzas.price,
      isActive: pizzas.isActive,
      createdAt: pizzas.createdAt,
      updatedAt: pizzas.updatedAt,
      category: {
        id: categories.id,
        name: categories.name,
      },
    })
    .from(pizzas)
    .innerJoin(categories, eq(pizzas.categoryId, categories.id))
    .where(filters)
    .orderBy(asc(pizzas.id))
    .limit(limit)
    .offset(offset);

  return { data, meta };
}

export async function getPizzaById(id: number) {
  const [result] = await db
    .select({
      pizza: pizzas,
      details: { preparationTime: pizzaDetails.preparationTime },
    })
    .from(pizzas)
    .leftJoin(pizzaDetails, eq(pizzas.id, pizzaDetails.pizzaId))
    .where(eq(pizzas.id, id));

  return result;
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
