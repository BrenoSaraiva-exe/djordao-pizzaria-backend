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
import { pizzaIngredients } from "../db/schema/pizza-ingredients.js";
import { ingredients } from "../db/schema/index.js";

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
      price: pizzas.price,
      is_active: pizzas.isActive,
      categoryName: categories.name,
      createdAt: pizzas.createdAt,
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
  const [pizza] = await db
    .select({
      pizza: pizzas,
      details: {
        preparationTime: pizzaDetails.preparationTime,
      },
      category: {
        id: categories.id,
        name: categories.name,
      },
    })
    .from(pizzas)
    .leftJoin(pizzaDetails, eq(pizzas.id, pizzaDetails.pizzaId))
    .innerJoin(categories, eq(pizzas.categoryId, categories.id))
    .where(eq(pizzas.id, id));

  if (!pizza) {
    return undefined;
  }

  const pizzaIngredientList = await db
    .select({
      id: ingredients.id,
      name: ingredients.name,
      description: ingredients.description,
      unit: ingredients.unit,
      price: ingredients.price,
    })
    .from(pizzaIngredients)
    .innerJoin(ingredients, eq(pizzaIngredients.ingredientId, ingredients.id))
    .where(eq(pizzaIngredients.pizzaId, id));

  return {
    ...pizza,
    ingredients: pizzaIngredientList,
  };
}

export async function createPizza(input: CreatePizzaInput) {
  const pizzaId = await db.transaction(async (tx) => {
    const { preparationTime, ingredients: ingredientIds, price, ...pizzaInput } =
      input;

    const [pizza] = await tx
      .insert(pizzas)
      .values({
        ...pizzaInput,
        price: price.toString(),
      })
      .returning({ id: pizzas.id });

    if (!pizza) {
      throw new Error("Pizza insert did not return the created record");
    }

    await tx.insert(pizzaDetails).values({
      pizzaId: pizza.id,
      preparationTime,
    });

    await tx.insert(pizzaIngredients).values(
      ingredientIds.map((ingredientId: CreatePizzaInput["ingredients"][number]) => ({
        pizzaId: pizza.id,
        ingredientId,
      })),
    );

    return pizza.id;
  });

  const pizza = await getPizzaById(pizzaId);

  if (!pizza) {
    throw new Error(`Created pizza ${pizzaId} could not be retrieved`);
  }

  return pizza;
}

export async function patchPizza(id: number, input: UpdatePizzaInput) {
  const updated = await db.transaction(async (tx) => {
    const {
      preparationTime,
      ingredients: ingredientIds,
      price,
      ...pizzaInput
    } = input;

    const [pizza] = await tx
      .update(pizzas)
      .set({
        ...pizzaInput,
        ...(price !== undefined ? { price: price.toString() } : {}),
        updatedAt: new Date(),
      })
      .where(eq(pizzas.id, id))
      .returning({ id: pizzas.id });

    if (!pizza) {
      return false;
    }

    if (preparationTime !== undefined) {
      await tx
        .insert(pizzaDetails)
        .values({ pizzaId: id, preparationTime })
        .onConflictDoUpdate({
          target: pizzaDetails.pizzaId,
          set: { preparationTime },
        });
    }

    if (ingredientIds !== undefined) {
      await tx.delete(pizzaIngredients).where(eq(pizzaIngredients.pizzaId, id));

      await tx.insert(pizzaIngredients).values(
        ingredientIds.map((ingredientId: CreatePizzaInput["ingredients"][number]) => ({
          pizzaId: id,
          ingredientId,
        })),
      );
    }

    return true;
  });

  return updated ? getPizzaById(id) : undefined;
}

export async function deletePizza(id: number) {
  const [pizza] = await db.transaction(async (tx) => {
    await tx.delete(pizzaDetails).where(eq(pizzaDetails.pizzaId, id));

    return tx.delete(pizzas).where(eq(pizzas.id, id)).returning();
  });

  return pizza;
}
