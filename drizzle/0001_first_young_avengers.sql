CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "pizzas" ADD COLUMN "category_id" integer;--> statement-breakpoint
ALTER TABLE "pizzas" ADD CONSTRAINT "pizzas_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;