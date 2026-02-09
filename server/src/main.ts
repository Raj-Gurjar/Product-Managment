import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable global validation with DTO transformation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip unknown properties
      transform: true, // Enable transformation via class-transformer
      forbidNonWhitelisted: true, // Throw error for unknown properties
    }),
  );
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
