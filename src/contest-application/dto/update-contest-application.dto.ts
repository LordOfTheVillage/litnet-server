import { IsOptional, IsInt, IsBoolean } from 'class-validator';

export class UpdateContestApplicationDto {
  @IsBoolean({ message: 'Must be a boolean' })
  readonly status: boolean;
}
