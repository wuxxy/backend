import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import settingsRoutes from './settings.js';

export default async function adminRoutes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {
     fastify.register(settingsRoutes, { prefix: '/settings' });
      
  fastify.get('/hello', async (request, reply) => {
    return { message: 'Hello from route file!' };
  });
}