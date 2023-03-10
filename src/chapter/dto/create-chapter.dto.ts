import { IsInt, IsString } from 'class-validator';

export class CreateChapterDto {
  @IsString({ message: 'Must be a string' })
  readonly title: string;

  @IsString({ message: 'Must be a string' })
  readonly text: string;

  @IsInt({ message: 'Must be a number' })
  readonly bookId: number;
}
