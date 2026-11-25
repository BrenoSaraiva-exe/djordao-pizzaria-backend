import { asc, eq, ilike, count, and } from "drizzle-orm";
import { ingredients } from "../db/schema/ingredients.js";
import type {
  CreateIngredientInput,
  ListIngredientsQuery,
  UpdateIngredientInput,
} from "../schemas/ingredients.schema.js";
import { db } from "../db/index.js";

export async function getAllIngredients(query: ListIngredientsQuery) {
  const page = query.page;
  const offset = (page - 1) * query.limit;
  const limit = query.limit;

  const conditions = [];

  if (query.name) {
    conditions.push(ilike(ingredients.name, `%${query.name}%`));
  }

  const filters = conditions.length > 0 ? and(...conditions) : undefined;

  const [result] = await db
    .select({ count: count() })
    .from(ingredients)
    .where(filters);
  const total = Number(result?.count ?? 0);
  const totalPages = Math.ceil(total / limit);

  const meta = { total, page, limit, totalPages };

  const data = await db
    .select({
      id: ingredients.id,
      name: ingredients.name,
      description: ingredients.description,
      price: ingredients.price,
      unit: ingredients.unit,
      isActive: ingredients.isActive,
      createdAt: ingredients.createdAt,
      updatedAt: ingredients.updatedAt,
    })
    .from(ingredients)
    .where(filters)
    .orderBy(asc(ingredients.id))
    .limit(limit)
    .offset(offset);

  return { data, meta };
}

export async function getIngredientById(id: number) {
  const [result] = await db
    .select({
      ingredient: ingredients,
    })
    .from(ingredients)
    .where(eq(ingredients.id, id));

  return result?.ingredient ?? null;
}

export async function createIngredient(input: CreateIngredientInput) {
  const [result] = await db
    .insert(ingredients)
    .values({
      ...input,
      price: input.price.toString(),
    })
    .returning();

  return result;
}

export async function patchIngredient(
  id: number,
  input: UpdateIngredientInput,
) {
  const [result] = await db
    .update(ingredients)
    .set({
      ...input,
      price: input.price?.toString(),
      updatedAt: new Date(),
    })
    .where(eq(ingredients.id, id))
    .returning();

  return result ?? null;
}

export async function deleteIngredient(id: number) {
  const [result] = await db
    .delete(ingredients)
    .where(eq(ingredients.id, id))
    .returning();

  return result ?? null;
}
