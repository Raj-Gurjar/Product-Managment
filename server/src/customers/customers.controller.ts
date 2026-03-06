import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { CustomersService } from './customers.service';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get('export')
  exportCustomers(@Res() res: Response) {
    return this.customersService.exportCSV(res);
  }
}
