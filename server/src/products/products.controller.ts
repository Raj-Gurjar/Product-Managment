// ==========================================================
// Products Controller -- HTTP Route Handler
// ==========================================================
//
// Express equivalent:
//   const router = express.Router();
//   router.post('/', async (req, res) => { ... });
//   module.exports = router;
//
// NestJS equivalent:
//   @Controller('products')     ← base route: /products
//   export class ProductsController {
//     @Post()                    ← POST /products
//     create(@Body() body) {}
//   }
//
// DECORATOR CHEAT SHEET:
//   @Get()          →  router.get('/')
//   @Post()         →  router.post('/')
//   @Patch(':id')   →  router.patch('/:id')
//   @Delete(':id')  →  router.delete('/:id')
//   @Body()         →  req.body
//   @Param('id')    →  req.params.id
//   @Query()        →  req.query
// ==========================================================

import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products') // All routes in this controller start with /products
export class ProductsController {
  // NestJS injects ProductsService automatically
  // Express equivalent: const productService = require('./products.service');
  constructor(private readonly productsService: ProductsService) {}

  // ── POST /products ─────────────────────────────────────
  //
  // Express equivalent:
  //   router.post('/', async (req, res) => {
  //     const product = await productService.create(req.body);
  //     res.status(201).json(product);
  //   });
  //
  // In NestJS:
  //   @Post()           → makes this a POST route
  //   @Body()           → extracts req.body
  //   CreateProductDto  → validates the body automatically!
  //   @HttpCode(201)    → sets response status to 201 Created
  // ────────────────────────────────────────────────────────
  @Post()
  @HttpCode(HttpStatus.CREATED) // Returns 201 instead of default 200
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }
}
