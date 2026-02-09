import { IsString, IsNotEmpty, IsInt, IsOptional, Min, IsNumber, Validate, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { Type } from 'class-transformer';

@ValidatorConstraint({ name: 'discountLessThanPrice', async: false })
class DiscountLessThanPriceConstraint implements ValidatorConstraintInterface {
  validate(totalDiscount: number, args: ValidationArguments) {
    const object = args.object as CreateProductDto;
    return totalDiscount <= object.totalPrice;
  }

  defaultMessage() {
    return 'totalDiscount cannot exceed totalPrice';
  }
}

export class CreateProductDto {
  @IsInt()
  @Min(1)
  @Type(() => Number)
  orderId: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  quantity: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  totalPrice: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Validate(DiscountLessThanPriceConstraint)
  @Type(() => Number)
  totalDiscount: number;
}
