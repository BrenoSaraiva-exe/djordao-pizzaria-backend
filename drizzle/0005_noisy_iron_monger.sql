CREATE TABLE "pizza_ingredients" (
	"pizza_id" integer NOT NULL,
	"ingredient_id" integer NOT NULL,
	CONSTRAINT "pizza_ingredients_pizza_id_ingredient_id_pk" PRIMARY KEY("pizza_id","ingredient_id")
);
--> statement-breakpoint
ALTER TABLE "pizza_ingredients" ADD CONSTRAINT "pizza_ingredients_pizza_id_pizzas_id_fk" FOREIGN KEY ("pizza_id") REFERENCES "public"."pizzas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pizza_ingredients" ADD CONSTRAINT "pizza_ingredients_ingredient_id_ingredients_id_fk" FOREIGN KEY ("ingredient_id") REFERENCES "public"."ingredients"("id") ON DELETE cascade ON UPDATE no action;