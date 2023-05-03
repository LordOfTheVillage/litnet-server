import { IsOptional, IsInt, IsBoolean } from 'class-validator';

export class PatchContestApplicationDto {
  @IsBoolean({ message: 'Must be a boolean' })
  readonly status: boolean;
}
