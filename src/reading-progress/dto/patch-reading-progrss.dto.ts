import { IsOptional } from 'class-validator';

export class PatchReadingProgressDto {
  @IsOptional()
  readonly chapterId: number;

  @IsOptional()
  readonly pageId: number;
}
