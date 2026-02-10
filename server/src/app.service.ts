import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `Server is Runnig in ${process.env.NODE_ENV} on port ${process.env.PORT}`;
  }
}
