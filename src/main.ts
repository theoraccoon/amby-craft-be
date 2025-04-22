import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookie from '@fastify/cookie';
import { setupSwagger } from './config/swagger.config';
import { FastifyInstance } from 'fastify';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );
  
  app.useGlobalPipes(new ValidationPipe());
  
  const fastifyApp = app.getHttpAdapter().getInstance() as FastifyInstance;
  
  await fastifyApp.register(cookie, {
    secret: process.env.COOKIE_SECRET,
    parseOptions: {},
  });
  
  app.setGlobalPrefix('api/v1');
  setupSwagger(app);

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap().catch((error) => {
  console.error('Error starting the application:', error);
  process.exit(1);
});
