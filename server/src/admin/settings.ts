import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { updateJsonFile } from '../utils/update-json.js';

export default async function settingsRoutes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {
  fastify.patch('/port', async (req, res) => {
    console.log(req.body)
    try {
        const new_port = (req.body as any)?.port;
        updateJsonFile("modifiable/settings.json", {
            PORT: new_port
        })
        res.send("Successfully changed port to: " + new_port)
    } catch (error) {
        res.send("error while handling: " + error )
    }
  });
}