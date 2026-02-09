// ==========================================================
// Root Application Module
// ==========================================================
//
// Express equivalent (app.js):
//   const productRoutes = require('./routes/products');
//   app.use('/products', productRoutes);
//
// In NestJS, you import modules here instead:
//   imports: [PrismaModule, ProductsModule]
// ==========================================================

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    PrismaModule,     // Database connection (available globally)
    ProductsModule,   // Product CRUD routes
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
