import { INestApplication } from '@nestjs/common'; // Add import for INestApplication
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';

export const setupSwagger = (app: INestApplication): void => {
    const config = new DocumentBuilder()
        .setTitle('Ambylon Craft API')
        .setDescription(
            `
# Introduction 

Ambylon Craft offers powerful tools to manage your projects, designs, and creative workflows.

## Features
- 🔥 Project management ->gibbrish
- 🧵 Craft item catalog  ->gibbrish
- 🚀 Real-time updates  ->gibbrish

## Authentication
To access private endpoints, use Bearer tokens.

\`\`\`
Authorization: Bearer YOUR_TOKEN_HERE
\`\`\`

[Learn more about Ambylon Craft](https://ambylon.example.com)

> Made with ❤️ for creators.
      `
        )
        .setVersion('1.0')
        .build();

    const documentFactory = () => SwaggerModule.createDocument(app, config);

    app.use(
        '/docs',
        apiReference({
            content: documentFactory,
        })
    );
};
