import { IsOptional } from 'class-validator';

export class PatchUserPasswordDto {
  @IsOptional()
  readonly password: string;
}
