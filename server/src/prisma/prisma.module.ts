// ==========================================================
// Prisma Module -- Makes database available app-wide
// ==========================================================
//
// @Global() means: every module in the app can use PrismaService
// without importing PrismaModule explicitly.
//
// Without @Global(), every module would need:
//   @Module({ imports: [PrismaModule] })
// ==========================================================

import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Makes PrismaService available everywhere
@Module({
  providers: [PrismaService],  // Register the service
  exports: [PrismaService],    // Allow other modules to use it
})
export class PrismaModule {}
