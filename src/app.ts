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

app.register(swagger, {
  openapi: {
    info: {
      title: "Djordão Pizzaria API",
      description: "API para gerenciamento da Pizzaria Dom Jordão",
      version: "1.0.0",
    },
  },
  transform: jsonSchemaTransform,
});
app.register(swaggerUi, {
  routePrefix: "/docs",
});

app.register(healthRoutes);
app.register(pizzaRoutes);
