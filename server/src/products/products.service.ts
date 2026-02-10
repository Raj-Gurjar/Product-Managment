import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { QueryProductDto } from './dto/query-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        orderId: createProductDto.orderId,
        title: createProductDto.title.trim(),
        description: createProductDto.description?.trim() || null,
        quantity: createProductDto.quantity,
        totalPrice: createProductDto.totalPrice,
        totalDiscount: createProductDto.totalDiscount,
      },
    });
  }

  async findAll(query: QueryProductDto) {
    const { orderId, title, sortBy = 'createdAt', sortOrder = 'desc', page = 1, limit = 10 } = query;

    const where: any = {
      deletedAt: null,
    };

    if (orderId) {
      where.orderId = orderId;
    }

    if (title) {
      where.title = {
        contains: title,
        mode: 'insensitive',
      };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get total count for pagination metadata
    const total = await this.prisma.product.count({ where });

    // Fetch products with sorting and pagination
    const products = await this.prisma.product.findMany({
      where,
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip,
      take: limit,
    });

    return {
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
