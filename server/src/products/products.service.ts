// ==========================================================
// Products Service -- Business Logic
// ==========================================================
//
// In Express, you'd put this logic directly inside route handlers:
//   router.post('/', async (req, res) => {
//     const product = await db.query('INSERT INTO ...');
//     res.json(product);
//   });
//
// In NestJS, we separate it:
//   Controller → handles HTTP (routes, status codes)
//   Service    → handles logic (validation, database queries)
//
// WHY? Easier to test, reuse, and maintain.
// ==========================================================

import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable() // NestJS can inject this service into controllers
export class ProductsService {
  // PrismaService is injected automatically by NestJS
  // Express equivalent: const prisma = require('../prisma');
  constructor(private prisma: PrismaService) {}

  // ── CREATE PRODUCT ──────────────────────────────────────
  async create(dto: CreateProductDto) {
    // Business rule: discount can't be more than the price
    if (dto.totalDiscount > dto.totalPrice) {
      // This automatically returns a 400 Bad Request response
      throw new BadRequestException(
        'totalDiscount cannot be greater than totalPrice',
      );
    }

    // Insert into database using Prisma
    // Express equivalent:
    //   await pool.query(
    //     'INSERT INTO products (order_id, title, ...) VALUES ($1, $2, ...)',
    //     [dto.orderId, dto.title, ...]
    //   );
    const product = await this.prisma.product.create({
      data: {
        orderId: dto.orderId,
        title: dto.title,
        description: dto.description,  // will be null if not provided
        quantity: dto.quantity,
        totalPrice: dto.totalPrice,
        totalDiscount: dto.totalDiscount,
      },
    });

    // Convert Prisma Decimal to number for JSON response
    return {
      ...product,
      totalPrice: Number(product.totalPrice),
      totalDiscount: Number(product.totalDiscount),
    };
  }
}
