import { IsOptional, IsInt, IsBoolean } from 'class-validator';

export class CreateContestApplicationDto {
  @IsInt({ message: 'Must be a number' })
  readonly contestId: number;

  @IsInt({ message: 'Must be a number' })
  readonly bookId: number;

  @IsOptional()
  @IsBoolean({ message: 'Must be a boolean' })
  readonly status: boolean;
}
