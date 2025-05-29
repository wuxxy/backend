import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { AUTH_PASS } from "./index.js";


export default async function authRoutes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {
  fastify.post("/login", async (req, reply) => {
    const { access_key } = req.body as { access_key?: string };

    if (!access_key || access_key !== AUTH_PASS) {
      return reply.status(401).send({ message: "Invalid access key" });
    }

    const user = {
      id: "admin",
      name: "Administrator",
      email: "admin@domain.com",
      role: "admin",
    };

    const token = fastify.jwt.sign(user, { expiresIn: "7d" });

    reply
      .setCookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
      .send(user);
  });

  fastify.post("/logout", async (_, reply) => {
    reply
      .clearCookie("token", { path: "/" })
      .status(200)
      .send({ message: "Logged out" });
  });

  fastify.get(
    "/me",
    { preHandler: [fastify.authenticate] },
    async (req) => {
      console.log(req.user)
      return req.user;
    }
  );
}
