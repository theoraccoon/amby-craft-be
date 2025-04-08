// src/app.ts
import { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';


export async function app(server: FastifyInstance) {
  await server.register(cors);

  server.get('/health', async () => ({ status: 'ok' }));

}
