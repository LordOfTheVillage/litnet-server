import { IsOptional } from 'class-validator';

export class PatchBlogDto {
  @IsOptional()
  readonly title: string;

  @IsOptional()
  readonly text: string;
}
