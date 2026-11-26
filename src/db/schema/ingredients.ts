import {
  pgTable,
  serial,
  varchar,
  text,
  numeric,
} from "drizzle-orm/pg-core";
import { activityColumns } from "./common.js";

export const ingredients = pgTable("ingredients", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  unit: varchar("unit", { length: 50 }).notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  ...activityColumns(),
});
