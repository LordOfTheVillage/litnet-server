import { IsInt, IsOptional, IsString } from 'class-validator';

export class PatchBookDto {
  @IsString({ message: 'Must be a string' })
  @IsOptional()
  readonly title: string;

  @IsString({ message: 'Must be a string' })
  @IsOptional()
  readonly description: string;

  @IsString({ message: 'Must be a string' })
  @IsOptional()
  readonly genres: string;
}
