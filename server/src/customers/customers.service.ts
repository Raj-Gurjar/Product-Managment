import { Injectable, OnModuleDestroy } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';
import { Pool, PoolClient } from 'pg';
import QueryStream from 'pg-query-stream';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CustomersService implements OnModuleDestroy {
  private pool: Pool;

  constructor(private configService: ConfigService) {
    const connectionString = this.configService.get<string>('DATABASE_URL');
    this.pool = new Pool({
      connectionString,
      max: 5, // Limit pools for lower resource usage
    });
  }

  async exportToExcel(res: Response) {
    const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
      stream: res,
      useStyles: false, // Efficiency: Disable styles to reduce CPU/RAM
      useSharedStrings: false, // Efficiency: Direct strings are faster for streaming
    });

    const worksheet = workbook.addWorksheet('Customers');

    worksheet.columns = [
      { header: 'ID', key: 'id', width: 40 },
      { header: 'User ID', key: 'userId', width: 40 },
      { header: 'Phone Number', key: 'phoneNumber', width: 25 },
      { header: 'Created At', key: 'createdAt', width: 30 },
      { header: 'Updated At', key: 'updatedAt', width: 30 },
    ];

    let client: PoolClient | undefined;
    try {
      client = await this.pool.connect();
      
      // 1. STREAMS FROM DB (Cursor)
      // Using pg-query-stream for row-by-row retrieval without massive object arrays
      const query = new QueryStream('SELECT id, "userId", "phoneNumber", "createdAt", "updatedAt" FROM "Customer" ORDER BY id ASC');
      const stream = client.query(query);

      // 2. STREAM EXCEL (No In-Memory Workbook)
      // We iterate over the database cursor stream & push rows into the Excel stream writer.
      for await (const row of stream) {
        worksheet.addRow({
          id: row.id,
          userId: row.userId,
          phoneNumber: row.phoneNumber,
          createdAt: row.createdAt.toISOString(),
          updatedAt: row.updatedAt.toISOString(),
        }).commit(); // Commit immediately to flush data to the result stream
      }

      await worksheet.commit();
      await workbook.commit();
    } catch (error) {
      console.error('Export failed:', error);
      if (!res.headersSent) {
        res.status(500).send('Export failed');
      }
    } finally {
      if (client) client.release();
    }
  }

  onModuleDestroy() {
    this.pool.end();
  }
}
