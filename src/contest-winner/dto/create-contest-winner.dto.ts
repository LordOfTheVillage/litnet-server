import { IsOptional, IsInt, IsBoolean } from 'class-validator';

export class CreateContestWinnerDto {
  @IsInt({ message: 'Must be a number' })
  readonly contestId: number;

  @IsInt({ message: 'Must be a number' })
  readonly bookId: number;
}
