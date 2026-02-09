// ==========================================================
// Create Product DTO -- Request Body Validation
// ==========================================================
//
// A DTO is like a "contract" that says:
//   "To create a product, you MUST send these fields."
//
// Express equivalent (manual validation in route):
//   if (!req.body.title) return res.status(400).json({ error: '...' });
//   if (req.body.quantity < 1) return res.status(400).json({ error: '...' });
//
// With DTOs, you just add decorators and NestJS validates
// automatically. If validation fails, it returns a nice
// 400 error with details -- zero extra code in your controller.
// ==========================================================

import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsPositive,
  Min,
  IsUUID,
} from 'class-validator';

export class CreateProductDto {
  @IsUUID()                                        // must be a valid UUID
  @IsNotEmpty({ message: 'orderId is required' })
  orderId: string;

  @IsString()
  @IsNotEmpty({ message: 'title is required' })    // cannot be empty string
  title: string;

  @IsOptional()                                    // this field is optional
  @IsString()
  description?: string;                            // ? means optional in TypeScript

  @IsNumber()
  @IsPositive({ message: 'quantity must be > 0' }) // must be 1 or more
  quantity: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0, { message: 'totalPrice must be >= 0' })
  totalPrice: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0, { message: 'totalDiscount must be >= 0' })
  totalDiscount: number;
}
