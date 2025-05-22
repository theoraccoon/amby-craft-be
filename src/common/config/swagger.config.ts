import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SWAGGER } from './constants';

export const setupSwagger = app => {
  const config = new DocumentBuilder()
    .setTitle(SWAGGER.SWAGGER_API)
    .setDescription(SWAGGER.SWAGGER_API_DESCRIPTION)
    .addOAuth2({
      type: 'oauth2',
      flows: {
        implicit: {
          authorizationUrl: 'http://localhost:3000/api/v1/auth/login/google',
          tokenUrl: 'http://localhost:3000/api/v1/auth/google/callback',
          scopes: {
            email: 'email',
            profile: 'profile',
          },
        },
      },
    })
    .setBasePath(SWAGGER.SWAGGER_API_PATH)
    .setContact('Ambylon Dev Team', 'https://google.com', 'dev@ambylon.com')
    .setLicense('MIT', 'https://google.com')
    .setTermsOfService('https://google.com')
    .addServer('http://localhost:3000', 'Localhost URL')
    .setVersion(SWAGGER.SWAGGER_API_VERSION)
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(SWAGGER.SWAGGER_API_PATH, app, documentFactory);
};
