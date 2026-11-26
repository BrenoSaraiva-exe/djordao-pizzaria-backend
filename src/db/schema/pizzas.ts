import {
  pgTable,
  serial,
  varchar,
  text,
  numeric,
  integer,
} from "drizzle-orm/pg-core";
import { categories } from "./categories.js";
import { activityColumns } from "./common.js";

export const pizzas = pgTable("pizzas", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  ...activityColumns(),
  categoryId: integer("category_id")
    .notNull()
    .references(() => categories.id),
});
