CREATE TABLE "pizza_details" (
	"id" serial PRIMARY KEY NOT NULL,
	"pizza_id" integer NOT NULL,
	"preparation_time" integer NOT NULL,
	CONSTRAINT "pizza_details_pizza_id_unique" UNIQUE("pizza_id")
);
--> statement-breakpoint
ALTER TABLE "pizza_details" ADD CONSTRAINT "pizza_details_pizza_id_pizzas_id_fk" FOREIGN KEY ("pizza_id") REFERENCES "public"."pizzas"("id") ON DELETE no action ON UPDATE no action;