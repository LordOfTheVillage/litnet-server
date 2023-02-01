import { IsString } from 'class-validator';

export class CreateGenreDto {
  @IsString({ message: 'Must be a string' })
  readonly name: string;
}
