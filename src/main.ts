import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as dotenv from 'dotenv';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';
import * as passport from 'passport';

import { setupSwagger } from '@config/swagger.config';
import { API_CONSTANTS, ERRORS, RUNNINGS, SESSION } from '@config/constants';

import { ResponseInterceptor } from 'src/common/interceptors/response.interceptor';
import { HttpExceptionFilter } from 'src/common/filters/http-exception.filter';
import { ValidationPipe } from 'src/common/pipes/vaildation.pipe';

dotenv.config();

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  // Environment validation
  const sessionSecret = process.env.SESSION_SECRET;
  const port = parseInt(process.env.PORT || '3000', 10);

  if (!sessionSecret) {
    throw new Error(SESSION.SESSION_SECRET_UNDEFINED);
  }

  // Middlewares
  app.use(cookieParser());
  app.use(
    session({
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  // Global config
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix(API_CONSTANTS.API_GLOBAL_PREFIX);

  // Swagger setup
  setupSwagger(app);

  // App startup
  await app.listen(port, RUNNINGS.BASE_HOST);
  const url = await app.getUrl();
  console.log(`${RUNNINGS.LISTENING_ON_PORT} ${port}`);
  console.log(`${RUNNINGS.RUNNING_ON} ${url}`);
}

// Bootstrap and handle startup errors
bootstrap().catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err);
  const stack = err instanceof Error ? err.stack : undefined;

  console.error(ERRORS.ERROR_STARTING_APPLICATION_MESSAGE, message, stack);
  process.exit(1);
});
