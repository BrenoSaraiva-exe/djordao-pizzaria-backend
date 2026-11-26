import { pgTable, integer, primaryKey } from "drizzle-orm/pg-core";

import { pizzas } from "./pizzas.js";
import { ingredients } from "./ingredients.js";

export const pizzaIngredients = pgTable(
  "pizza_ingredients",
  {
    pizzaId: integer("pizza_id")
      .notNull()
      .references(() => pizzas.id, { onDelete: "cascade" }),

    ingredientId: integer("ingredient_id")
      .notNull()
      .references(() => ingredients.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({
      columns: [table.pizzaId, table.ingredientId],
    }),
  ],
);
