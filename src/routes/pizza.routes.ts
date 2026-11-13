import type { ZodTypeProvider } from "@fastify/type-provider-zod";
import type { FastifyPluginAsync } from "fastify";
import { z } from "zod/v4";
import { eq } from "drizzle-orm";

import { db } from "../db/index.js";
import { pizzas } from "../db/schema/pizzas.js";

const createPizzaSchema = z.object({
  name: z.string().trim().min(2).max(80),
  description: z.string().trim().min(5).max(300),
  price: z.number().positive(),
});

const updatePizzaSchema = createPizzaSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

const pizzaRoutes: FastifyPluginAsync = async (app) => {
  const server = app.withTypeProvider<ZodTypeProvider>();

  server.get(
    "/pizzas",
    {
      schema: {
        tags: ["Pizzas"],
      },
    },
    async (_request, reply) => {
      const data = await db.select().from(pizzas);

      return reply.status(200).send({
        message: "Pizzas retrieved successfully",
        data,
      });
    },
  );

  server.post(
    "/pizzas",
    {
      schema: {
        tags: ["Pizzas"],
        body: createPizzaSchema,
      },
    },
    async (request, reply) => {
      const [data] = await db
        .insert(pizzas)
        .values({
          ...request.body,
          price: request.body.price.toString(),
        })
        .returning();

      return reply.status(201).send({
        message: "Pizza created successfully",
        data,
      });
    },
  );

  server.get(
    "/pizzas/:id",
    {
      schema: {
        tags: ["Pizzas"],
        params: z.object({
          id: z.coerce.number().int().positive(),
        }),
      },
    },
    async (request, reply) => {
      const [data] = await db
        .select()
        .from(pizzas)
        .where(eq(pizzas.id, request.params.id));

      if (!data) {
        return reply.status(404).send({
          message: "Pizza not found",
        });
      }

      return reply.status(200).send({
        message: "Pizza retrieved successfully",
        data,
      });
    },
  );

  server.delete(
    "/pizzas/:id",
    {
      schema: {
        tags: ["Pizzas"],
        params: z.object({
          id: z.coerce.number().int().positive(),
        }),
      },
    },
    async (request, reply) => {
      const [deletedPizza] = await db
        .delete(pizzas)
        .where(eq(pizzas.id, request.params.id))
        .returning();

      if (!deletedPizza) {
        return reply.status(404).send({
          message: "Pizza not found",
        });
      }

      return reply.status(200).send({
        message: "Pizza deleted successfully",
      });
    },
  );

  server.patch(
    "/pizzas/:id",
    {
      schema: {
        tags: ["Pizzas"],
        params: z.object({
          id: z.coerce.number().int().positive(),
        }),
        body: updatePizzaSchema,
      },
    },
    async (request, reply) => {
      const [updatedPizza] = await db
        .update(pizzas)
        .set({
          ...request.body,
          price: request.body.price?.toString(),
          updatedAt: new Date(),
        })
        .where(eq(pizzas.id, request.params.id))
        .returning();

      if (!updatedPizza) {
        return reply.status(404).send({
          message: "Pizza not found",
        });
      }

      return reply.status(200).send({
        message: "Pizza updated successfully",
        data: updatedPizza,
      });
    },
  );
};

export default pizzaRoutes;
