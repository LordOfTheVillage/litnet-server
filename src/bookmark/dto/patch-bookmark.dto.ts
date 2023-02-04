import { IsOptional } from 'class-validator';

export class PatchBookmarkDto {
  @IsOptional()
  readonly chapterId: number;

  @IsOptional()
  readonly pageId: number;
}
