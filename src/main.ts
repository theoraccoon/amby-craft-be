import { NestFactory } from '@nestjs/core';
import * as session from 'express-session';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as passport from 'passport';
import { setupSwagger } from '@config/swagger.config';

import * as dotenv from 'dotenv';
import { API_CONSTANTS, ERRORS, RUNNINGS, SESSION } from '@config/constants';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  const sessionSecret = process.env.SESSION_SECRET;
  app.useGlobalInterceptors(new TransformInterceptor());

  if (!sessionSecret) {
    throw new Error(SESSION.SESSION_SECRET_UNDEFINED);
  }

  app.use(
    session({
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
    }),
  );

  app.setGlobalPrefix(API_CONSTANTS.API_GLOBAL_PREFIX);
  setupSwagger(app);

  app.use(passport.initialize());

  app.use(passport.session());

  await app.listen(process.env.PORT ?? 3000, RUNNINGS.BASE_HOST);
  console.log(RUNNINGS.LISTENING_ON_PORT, process.env.PORT ?? 3000);
  console.log(RUNNINGS.RUNNING_ON, ` ${await app.getUrl()}`);
}

bootstrap().catch((err: unknown) => {
  if (err instanceof Error) {
    console.error(ERRORS.ERROR_STARTING_APPLICATION_MESSAGE, err.message, err.stack);
  } else {
    console.error(ERRORS.ERROR_STARTING_APPLICATION_MESSAGE, String(err));
  }
  process.exit(1);
});
