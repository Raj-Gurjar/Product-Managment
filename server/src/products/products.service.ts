import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
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

    const skip = (page - 1) * limit;

    const total = await this.prisma.product.count({ where });

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

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    await this.findOne(id);

    const updateData: any = {};

    if (updateProductDto.title !== undefined) {
      updateData.title = updateProductDto.title.trim();
    }

    if (updateProductDto.description !== undefined) {
      updateData.description = updateProductDto.description?.trim() || null;
    }

    if (updateProductDto.quantity !== undefined) {
      updateData.quantity = updateProductDto.quantity;
    }

    if (updateProductDto.totalPrice !== undefined) {
      updateData.totalPrice = updateProductDto.totalPrice;
    }

    if (updateProductDto.totalDiscount !== undefined) {
      updateData.totalDiscount = updateProductDto.totalDiscount;
    }

    return this.prisma.product.update({
      where: { id },
      data: updateData,
    });
  }

  async softDelete(id: string) {
    await this.findOne(id);

    return this.prisma.product.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async restore(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    if (!product.deletedAt) {
      throw new NotFoundException(`Product with ID ${id} is not deleted`);
    }

    return this.prisma.product.update({
      where: { id },
      data: { deletedAt: null },
    });
  }

  async restoreAll() {
    const result = await this.prisma.product.updateMany({
      where: {
        deletedAt: { not: null },
      },
      data: {
        deletedAt: null,
      },
    });

    return {
      message: `Successfully restored ${result.count} product(s)`,
      count: result.count,
    };
  }
}


