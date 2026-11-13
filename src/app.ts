import Fastify from "fastify";

import healthRoutes from "./routes/health.routes.js";
import pizzaRoutes from "./routes/pizza.routes.js";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from "@fastify/type-provider-zod";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";

export const app = Fastify({
  logger: true,
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.setErrorHandler((error, request, reply) => {
  request.log.error(error);

  const isError = error instanceof Error;

  const statusCode =
    isError && "statusCode" in error && typeof error.statusCode === "number"
      ? error.statusCode
      : 500;

  if (statusCode >= 400 && statusCode < 500) {
    return reply.status(statusCode).send({
      message: isError ? error.message : "Bad request",
    });
  }

  return reply.status(500).send({
    message: "Internal server error",
  });
});

app.register(swagger, {
  openapi: {
    info: {
      title: "Djordão Pizzaria API",
      description: "API para gerenciamento da Pizzaria Dom Jordão",
      version: "1.0.0",
    },
    tags: [
      {
        name: "Pizzas",
        description: "Rotas para gerenciamento de pizzas",
      },
    ],
  },
  transform: jsonSchemaTransform,
});
app.register(swaggerUi, {
  routePrefix: "/docs",
});

app.register(pizzaRoutes);
