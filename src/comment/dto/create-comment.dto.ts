import {IsInt } from 'class-validator';

export class CreateCommentDto {
  readonly text: string;

  @IsInt({ message: 'Must be an integer number' })
  readonly bookId: number;

  @IsInt({ message: 'Must be an integer number' })
  readonly userId: number;
}
