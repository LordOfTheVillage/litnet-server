import { Max, Min, IsEmail, Length, IsInt } from 'class-validator';

export class CreateRatingDto {
  @IsInt({ message: 'Must be an integer number' })
  @Min(1, { message: 'Must be 1 or more' })
  @Max(10, { message: 'Must be 10 or less' })
  readonly rating: number;

  @IsInt({ message: 'Must be an integer number' })
  readonly bookId: number;

  @IsInt({ message: 'Must be an integer number' })
  readonly userId: number;
}
