import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SWAGGER } from '@config/constants';

export const setupSwagger = app => {
  const config = new DocumentBuilder().setTitle(SWAGGER.SWAGGER_API).setDescription(SWAGGER.SWAGGER_API_DESCRIPTION).setVersion(SWAGGER.SWAGGER_API_VERSION).build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(SWAGGER.SWAGGER_API_PATH, app, documentFactory);
};
