import { IsOptional } from 'class-validator';

export class PatchContestDto {
  @IsOptional()
  readonly title: string;

  @IsOptional()
  readonly description: string;

  @IsOptional()
  readonly prize: string | number;

  @IsOptional()
  readonly userId: string | number;

  @IsOptional()
  readonly date: string;

  @IsOptional()
  readonly countCharacters: string | number;

  @IsOptional()
  readonly genres: string;
}
