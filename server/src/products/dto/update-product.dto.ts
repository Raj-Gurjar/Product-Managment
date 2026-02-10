import { IsString, IsOptional, IsInt, Min, IsNumber, Validate, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { Type } from 'class-transformer';

@ValidatorConstraint({ name: 'discountLessThanPrice', async: false })
class DiscountLessThanPriceConstraint implements ValidatorConstraintInterface {
  validate(totalDiscount: number, args: ValidationArguments) {
    const object = args.object as UpdateProductDto;
    if (object.totalPrice !== undefined && totalDiscount !== undefined) {
      return totalDiscount <= object.totalPrice;
    }
    return true;
  }

  defaultMessage() {
    return 'totalDiscount cannot exceed totalPrice';
  }
}

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  quantity?: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  totalPrice?: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Validate(DiscountLessThanPriceConstraint)
  @Type(() => Number)
  @IsOptional()
  totalDiscount?: number;
}
