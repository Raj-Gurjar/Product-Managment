import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ── Global Validation ──────────────────────────────────────
  // This tells NestJS: "Automatically validate every incoming
  // request body using the rules defined in our DTO classes."
  //
  // Express equivalent: you'd manually check req.body in each route
  //   if (!req.body.title) return res.status(400).json(...)
  //
  // With this pipe, NestJS does it for you automatically!
  // ────────────────────────────────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            // strips unknown properties from body
      forbidNonWhitelisted: true, // throws error if unknown properties sent
      transform: true,            // auto-converts types (string "5" → number 5)
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Server running on http://localhost:${process.env.PORT ?? 3000}`);
}
bootstrap();
