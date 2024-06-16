import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  const Cors = {
    origin: ['http://localhost:5001'],
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS'
  };
  const Options = new DocumentBuilder()
    .setTitle('CodeVase Api version 1.0.0')
    .setDescription(`Codebase is an online learning tool for beginers to write code, run their code and test their code`)
    .setVersion('version 1.0.0')
    .addBearerAuth()
    .build()
  const Document = SwaggerModule.createDocument(app, Options);
  SwaggerModule.setup('api/v1', app, Document);
  app.enableCors(Cors);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(4000);
}
bootstrap();
