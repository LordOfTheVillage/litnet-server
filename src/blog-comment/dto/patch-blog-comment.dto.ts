import { IsOptional } from 'class-validator';

export class PatchBlogCommentDto {
  @IsOptional()
  readonly text: string;
}
