// Import the framework and instantiate it
import Fastify, { FastifyInstance } from 'fastify'
import {Server} from 'socket.io'
import msgpackPlugin from './utils/msgpack.js';
import adminRoutes from './admin/module.js';
import SETTINGS from "../modifiable/settings.json" assert { type: "json" };

const SERVER_PORT: number = parseInt(SETTINGS.PORT) || 3000;

const AUTH_PASS = "password";

const fastify = Fastify({
  logger: true
})
fastify.decorate('io', new Server(fastify.server));

fastify.register(adminRoutes, { prefix: '/admin' });
// Declare a route
fastify.get('/', async function handler (request, reply) {
  return { hello: 'world' }
})

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