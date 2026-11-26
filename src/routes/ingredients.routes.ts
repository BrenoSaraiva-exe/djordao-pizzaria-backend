import type { ZodTypeProvider } from "@fastify/type-provider-zod";
import type { FastifyPluginAsync } from "fastify";

import { idParamsSchema } from "../schemas/common.schema.js";
import {
  createIngredientSchema,
  listIngredientsQuerySchema,
  updateIngredientSchema,
} from "../schemas/ingredients.schema.js";
import {
  createIngredient,
  deleteIngredient,
  getAllIngredients,
  getIngredientById,
  patchIngredient,
} from "../services/ingredient.service.js";

const ingredientsRoutes: FastifyPluginAsync = async (app) => {
  const server = app.withTypeProvider<ZodTypeProvider>();

  server.get(
    "/ingredients",
    {
      schema: {
        tags: ["Ingredients"],
        querystring: listIngredientsQuerySchema,
      },
    },
    async (request, reply) => {
      const data = await getAllIngredients(request.query);

      return reply.status(200).send({
        message: "Ingredients retrieved successfully",
        data: data.data,
        meta: data.meta,
      });
    },
  );

  server.post(
    "/ingredients",
    {
      schema: {
        tags: ["Ingredients"],
        body: createIngredientSchema,
      },
    },
    async (request, reply) => {
      const data = await createIngredient(request.body);

      return reply.status(201).send({
        message: "Ingredient created successfully",
        data,
      });
    }
  );

  server.get(
    "/ingredients/:id",
    {
      schema: {
        tags: ["Ingredients"],
        params: idParamsSchema,
      },
    },
    async (request, reply) => {
      const data = await getIngredientById(request.params.id);

      if (!data) {
        return reply.status(404).send({
          message: "Ingredient not found",
        });
      }

      return reply.status(200).send({
        message: "Ingredient retrieved successfully",
        data,
      });
    }
  );

  server.patch(
    "/ingredients/:id",
    {
      schema: {
        tags: ["Ingredients"],
        params: idParamsSchema,
        body: updateIngredientSchema,
      },
    },
    async (request, reply) => {
      const data = await patchIngredient(request.params.id, request.body);

      if (!data) {
        return reply.status(404).send({
          message: "Ingredient not found",
        });
      }

      return reply.status(200).send({
        message: "Ingredient updated successfully",
        data,
      });
    }
  );

  server.delete(
    "/ingredients/:id",
    {
      schema: {
        tags: ["Ingredients"],
        params: idParamsSchema,
      },
    },
    async (request, reply) => {
      const deletedIngredient = await deleteIngredient(request.params.id);

      if (!deletedIngredient) {
        return reply.status(404).send({
          message: "Ingredient not found",
        });
      }

      return reply.status(200).send({
        message: "Ingredient deleted successfully",
      });
    }
  );
};

export default ingredientsRoutes;
