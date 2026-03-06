import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { Pool } from 'pg';
import Cursor from 'pg-cursor';
import { stringify } from 'csv-stringify';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CustomersService {
  private pool: Pool;

  constructor(private config: ConfigService) {
    this.pool = new Pool({
      connectionString: this.config.get('DATABASE_URL'),
      max: 2,
    });
  }

  async exportCSV(res: Response) {
    const client = await this.pool.connect();

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition','attachment; filename=customers.csv');

    const csv = stringify({ header: true });
    csv.pipe(res);

    const cursor = client.query(
      new Cursor(`
        SELECT id, "userId", "phoneNumber", "createdAt", "updatedAt"
        FROM "Customer"
      `)
    );

    const batchSize = 1000;

    const read = () => {
      cursor.read(batchSize, (err, rows) => {
        if (err) {
          client.release();
          res.end();
          return;
        }

        if (!rows.length) {
          cursor.close(() => client.release());
          csv.end();
          return;
        }

        for (const row of rows) {
          csv.write(row);
        }

        read();
      });
    };

    read();
  }
}