import { IsOptional } from 'class-validator';

export class PatchReadingProgressDto {
  @IsOptional()
  chapterId: number;

  @IsOptional()
  pageId: number;
}
