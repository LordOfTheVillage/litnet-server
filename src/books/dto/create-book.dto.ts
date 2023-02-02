import { IsInt, IsString } from 'class-validator';

export class CreateBookDto {
  @IsString({ message: 'Must be a string' })
  readonly title: string;

  // @IsInt({ message: 'Must be a number' })
  readonly userId: number;

  @IsString({ message: 'Must be a string' })
  readonly genres: string;
}
