import { ZodTypeProvider } from "@fastify/type-provider-zod";
import type { FastifyPluginAsync } from "fastify";
import { z } from "zod/v4";

const createPizzaSchema = z.object({
  name: z.string().trim().min(2).max(80),
  description: z.string().trim().min(5).max(300),
  price: z.number().positive(),
});

const pizzaRoutes: FastifyPluginAsync = async (app) => {
  const server = app.withTypeProvider<ZodTypeProvider>();

  server.post(
    "/pizzas",
    {
      schema: {
        body: createPizzaSchema,
      },
    },
    async (request, reply) => {
      const pizza = request.body;

      return reply.status(201).send({
        message: "Pizza created successfully",
        pizza,
      });
    },
  );
};

export default pizzaRoutes;
