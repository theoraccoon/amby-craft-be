import { NestFactory } from '@nestjs/core';
import * as session from 'express-session';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as passport from 'passport';
import { setupSwagger } from './config/swagger.config';
import * as dotenv from 'dotenv';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
dotenv.config();

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalInterceptors(new TransformInterceptor());
    app.use(cookieParser());
    const sessionSecret = process.env.SESSION_SECRET;

    if (!sessionSecret) {
        throw new Error(
            'SESSION_SECRET is not defined in the environment variables'
        );
    }

    app.use(
        session({
            secret: sessionSecret,
            resave: false,
            saveUninitialized: false,
        })
    );

    app.setGlobalPrefix('api/v1');

    setupSwagger(app);

    app.use(passport.initialize());

    app.use(passport.session());

    await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
    console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap().catch((err: unknown) => {
    if (err instanceof Error) {
        console.error(
            'Error starting the application:',
            err.message,
            err.stack
        );
    } else {
        console.error('Error starting the application:', String(err));
    }
    process.exit(1);
});
