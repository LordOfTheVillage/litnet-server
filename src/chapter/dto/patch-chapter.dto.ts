import { IsInt, IsString } from "class-validator";

export class PatchChapterDto {
  @IsString({ message: 'Must be a string' })
  readonly title: string;
}