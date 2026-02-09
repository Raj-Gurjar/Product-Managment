// ==========================================================
// Prisma Service -- Database Connection
// ==========================================================
//
// Express equivalent:
//   const { Pool } = require('pg');
//   const pool = new Pool({ connectionString: process.env.DATABASE_URL });
//   module.exports = pool;
//
// In NestJS, we wrap it in a service so any part of the app
// can "inject" it via the constructor.
// ==========================================================

import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable() // This decorator lets NestJS inject this service anywhere
export class PrismaService
  extends PrismaClient // Inherits all Prisma query methods
  implements OnModuleInit, OnModuleDestroy
{
  // Called automatically when the app starts
  async onModuleInit() {
    await this.$connect(); // Open database connection
    console.log('Database connected');
  }

  // Called automatically when the app shuts down
  async onModuleDestroy() {
    await this.$disconnect(); // Close database connection
  }
}
