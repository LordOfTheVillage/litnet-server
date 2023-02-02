import { Max, Min, IsEmail, Length, IsInt } from 'class-validator';

export class CreateRatingDto {
  @IsInt({ message: 'Must be an integer number' })
  @Min(1, { message: 'Must be 1 or more' })
  @Max(10, { message: 'Must be 10 or less' })
  readonly rating: number;

  readonly bookId: number;
  readonly userId: number;
}
