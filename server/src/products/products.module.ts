// ==========================================================
// Products Module -- Ties everything together
// ==========================================================
//
// A module groups related code:
//   - Controller (routes)
//   - Service (logic)
//
// Express equivalent:
//   // In app.js:
//   const productRoutes = require('./routes/products');
//   app.use('/products', productRoutes);
//
// In NestJS, you declare it in the module and import the
// module into AppModule. NestJS wires everything automatically.
// ==========================================================

import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  controllers: [ProductsController], // Route handlers
  providers: [ProductsService],      // Business logic services
})
export class ProductsModule {}
