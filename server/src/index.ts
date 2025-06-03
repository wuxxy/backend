// Import the framework and instantiate it
import Fastify, { FastifyInstance } from 'fastify'
import { Server } from "socket.io";
import adminRoutes from "./admin/module.js";
import fs from "fs";
import { read_json_file } from "./utils/file_manager.js";
import { StatusCodes } from "http-status-codes";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";
import jwt from "@fastify/jwt";
const SETTINGS = read_json_file("./modifiable/settings.json");

const SERVER_PORT: number = parseInt(SETTINGS.PORT) || 3000;

// ######################## MUST CHANGE ######################## //
/*            */ export const AUTH_PASS = "password"; /*          */
// #############################################################  //
import "@fastify/jwt";
import authRoutes from "./auth.js";
declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: {
      id: string;
      name: string;
      email: string;
      role?: string;
    };
    user: {
      id: string;
      name: string;
      email: string;
      role?: string;
    };
  }
}
declare module "fastify" {
  interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply
    ) => Promise<void>;
  }
}

const fastify = Fastify({
  logger: true,
});
fastify.register(cors, {
  origin: (origin, cb) => {
    const allowedOrigins = ["http://localhost:5173"];

    if (!origin || allowedOrigins.includes(origin)) {
      cb(null, true); // ✅ Allow
    } else {
      cb(new Error("Not allowed by CORS"), false); // ❌ Block
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "auth_pass"],
  credentials: true, // only enable this if you need cookie-based auth
  optionsSuccessStatus: 204,
});
fastify.register(cookie);
fastify.register(jwt, {
  secret: process.env.JWT_SECRET || "super-secret", // use env var in prod
  cookie: {
    cookieName: "token",
    signed: false,
  },
});
fastify.decorate("authenticate", async function (request, reply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.status(401).send({ message: "Unauthorized" });
    return;
  }
});
fastify.register(import("@fastify/formbody"));
fastify.decorate("io", new Server(fastify.server));

fastify.register(adminRoutes, { prefix: "/admin" });
fastify.register(authRoutes, { prefix: "/auth" });
// Declare a route
fastify.get("/", async function handler(request, reply) {
  return { hello: "world" };
});
fastify.get("/check_password", async function handler(request, reply) {
  if ((request.query as any)?.password === AUTH_PASS)
    return reply.status(200).send("Correct password");
  return reply.status(StatusCodes.UNAUTHORIZED).send("Incorrect Password");
});
fastify.addHook('onClose', (fastify: FastifyInstance, done) => {
    (fastify as any).io.close();
    (fastify as any).io.local.disconnectSockets(true);
    done();
  })

// Run the server!
try {
    await fastify.listen({ port: SERVER_PORT });
    console.log("Running on Port", SERVER_PORT)
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}