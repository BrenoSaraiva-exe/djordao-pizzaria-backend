import {
  pgTable,
  serial,
  varchar,
  text,
  numeric,
  boolean,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";
import { categories } from "./categories.js";

export const pizzas = pgTable("pizzas", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  categoryId: integer("category_id").references(() => categories.id, {
    onDelete: "no action",
  }),
});
