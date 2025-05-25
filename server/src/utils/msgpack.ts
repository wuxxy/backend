import { FastifyPluginAsync } from 'fastify';
import { decode } from '@msgpack/msgpack';

const msgpackPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.addContentTypeParser(
    'application/x-msgpack',
    { parseAs: 'buffer' },
    (req, body, done) => {
      try {
        const decoded = decode(body as Uint8Array);
        done(null, decoded); // 👈 critical!
      } catch (err) {
        done(err as any);
      }
    }
  );
};

export default msgpackPlugin;


