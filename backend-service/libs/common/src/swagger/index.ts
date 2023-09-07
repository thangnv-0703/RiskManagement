import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import * as basicAuth from 'express-basic-auth';

export const setupOpenApi = (
  app: INestApplication,
  title: string,
  description: string,
  version: string
) => {
  const config = new DocumentBuilder()
    .setTitle(title)
    .setDescription(description)
    .addBearerAuth(
      {
        // I was also testing it without prefix 'Bearer ' before the JWT
        description: `[just text field] Please enter token in following format: Bearer <JWT>`,
        name: 'Authorization',
        bearerFormat: 'Bearer', // I`ve tested not to use this field, but the result was the same
        scheme: 'Bearer',
        type: 'http', // I`ve attempted type: 'apiKey' too
        in: 'Header',
      },
      'authorization'
    )
    .setVersion(version)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  // app.use(
  //   // Paths you want to protect with basic auth
  //   '/docs*',
  //   basicAuth({
  //     challenge: true,
  //     users: {
  //       yourUserName: 'p4ssw0rd',
  //     },
  //   })
  // );
  SwaggerModule.setup('api/doc', app, document, { useGlobalPrefix: true });
};
