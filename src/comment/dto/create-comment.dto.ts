import { IsInt } from 'class-validator';

export class CreateCommentDto {
  readonly text: string;
  readonly bookId: number;
  readonly userId: number;
}
