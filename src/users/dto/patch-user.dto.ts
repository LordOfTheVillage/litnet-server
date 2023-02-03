import { IsOptional } from "class-validator";

export class PatchUserDto {
  @IsOptional()
  email: string;

  @IsOptional()
  password: string;

  @IsOptional()
  name: string;
}