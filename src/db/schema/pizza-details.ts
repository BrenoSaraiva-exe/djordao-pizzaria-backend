import { pgTable, serial, integer } from "drizzle-orm/pg-core";
import { pizzas } from "./pizzas.js";

export const pizzaDetails = pgTable("pizzas", {
  id: serial("id").primaryKey(),
  pizzaId: integer("pizza_id")
    .notNull()
    .references(() => pizzas.id)
    .unique(),
  preparationTime: integer("preparation_time").notNull(),
});
