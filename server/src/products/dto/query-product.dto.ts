import { IsOptional, IsString, IsInt, Min, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryProductDto {

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  orderId?: number;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsIn(['id', 'title', 'quantity', 'totalPrice', 'totalDiscount', 'createdAt', 'updatedAt'])
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'desc';

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number = 10;
}
