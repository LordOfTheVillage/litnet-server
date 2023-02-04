import { IsOptional } from 'class-validator';

export class PatchContestDto {
  @IsOptional()
  title: string;

  @IsOptional()
  description: string;

  @IsOptional()
  prize: string | number;

  @IsOptional()
  userId: string | number;

  @IsOptional()
  date: string;

  @IsOptional()
  countCharacters: string | number;

  @IsOptional()
  genres: string;
}
