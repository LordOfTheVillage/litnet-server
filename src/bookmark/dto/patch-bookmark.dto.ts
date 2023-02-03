import { IsOptional } from 'class-validator';

export class PatchBookmarkDto {
  @IsOptional()
  chapterId: number;

  @IsOptional()
  pageId: number;
}
