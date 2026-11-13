import type { ZodTypeProvider } from "@fastify/type-provider-zod";
import type { FastifyPluginAsync } from "fastify";
import { z } from "zod/v4";

import {
  createPizzaSchema,
  listPizzasQuerySchema,
  updatePizzaSchema,
} from "../schemas/pizza.schema.js";
import {
  createPizza,
  deletePizza,
  getAllPizzas,
  getPizzaById,
  patchPizza,
} from "../services/pizza.service.js";

const pizzaRoutes: FastifyPluginAsync = async (app) => {
  const server = app.withTypeProvider<ZodTypeProvider>();

  server.get(
    "/pizzas",
    {
      schema: {
        tags: ["Pizzas"],
        querystring: listPizzasQuerySchema,
      },
    },
    async (request, reply) => {
      const data = await getAllPizzas(request.query);

      return reply.status(200).send({
        message: "Pizzas retrieved successfully",
        data: data.data,
        meta: data.meta,
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
      const data = await createPizza(request.body);

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
      const data = await getPizzaById(request.params.id);

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
      const deletedPizza = await deletePizza(request.params.id);

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
      const updatedPizza = await patchPizza(request.params.id, request.body);

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
