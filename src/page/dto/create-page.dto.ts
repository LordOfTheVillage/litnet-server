import { IsOptional } from 'class-validator';

export class CreatePageDto {
  @IsOptional()
  readonly number: number;

  readonly text: string;

  readonly chapterId: number;
}
