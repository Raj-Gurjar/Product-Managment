import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async exportToExcel(res: Response) {
    const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
      stream: res,
      useStyles: true,
      useSharedStrings: true,
    });

    const worksheet = workbook.addWorksheet('Customers');

    worksheet.columns = [
      { header: 'ID', key: 'id', width: 40 },
      { header: 'User ID', key: 'userId', width: 40 },
      { header: 'Phone Number', key: 'phoneNumber', width: 25 },
      { header: 'Created At', key: 'createdAt', width: 30 },
      { header: 'Updated At', key: 'updatedAt', width: 30 },
    ];

    const batchSize = 5000;
    let cursor: string | undefined = undefined;

    try {
      while (true) {
        const customers = await this.prisma.customer.findMany({
          take: batchSize,
          skip: cursor ? 1 : 0,
          cursor: cursor ? { id: cursor } : undefined,
          orderBy: { id: 'asc' },
        });

        if (customers.length === 0) break;

        for (const customer of customers) {
          worksheet.addRow({
            id: customer.id,
            userId: customer.userId,
            phoneNumber: customer.phoneNumber,
            createdAt: customer.createdAt.toISOString(),
            updatedAt: customer.updatedAt.toISOString(),
          }).commit();
        }

        cursor = customers[customers.length - 1].id;
      }

      await worksheet.commit();
      await workbook.commit();
    } catch (error) {
      console.error('Export failed:', error);
      if (!res.headersSent) {
        res.status(500).send('Export failed');
      }
    }
  }
}
