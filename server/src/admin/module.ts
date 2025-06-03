import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import settingsRoutes from './settings.js';
import { AUTH_PASS } from "../index.js";
import requestsRoutes from "./requests.js";

export default async function adminRoutes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {
  fastify.addHook("onRequest", async (req, reply) => {
    const pass = req.headers["auth_pass"];
    if (pass !== AUTH_PASS) {
      reply.code(401).send({ error: "Unauthorized" });
      return;
    }
  });
  fastify.register(settingsRoutes, { prefix: "/settings" });
  fastify.register(requestsRoutes, { prefix: "/requests" });
}