// src/server.ts
import { fastify } from 'fastify';
import { app } from './app';

const server = fastify({ logger: true });

app(server);

server.listen({ port: 3000 }, (err) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
});
