import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const setupSwagger = app => {
  const config = new DocumentBuilder().setTitle('Ambylon Craft API').setDescription('The Ambylon Craft API description').setVersion('1.0').build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);
};
