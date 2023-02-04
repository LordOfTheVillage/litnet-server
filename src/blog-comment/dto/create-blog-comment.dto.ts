export class CreateBlogCommentDto {
  readonly text: string;
  readonly blogId: number;
  readonly userId: number;
}
