import { IsOptional } from "class-validator";

export class PatchUserDto {
  @IsOptional()
  readonly email: string;

  @IsOptional()
  readonly password: string;

  @IsOptional()
  readonly readingView: string;

  @IsOptional()
  readonly name: string;
}