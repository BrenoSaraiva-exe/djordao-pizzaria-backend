import {
  pgTable,
  serial,
  integer,
} from "drizzle-orm/pg-core";
import { pizzas } from "./pizzas.js";

export const pizzaDetails = pgTable("pizzas", {
  id: serial("id").primaryKey(),
  pizzaId: integer("pizza_id")
    .notNull()
    .references(() => pizzas.id),
  preparationTime: integer("preparationTime").notNull(),
});
