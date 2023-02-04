export class CreateBlogDto {
  readonly title: string;
  readonly text: string;
  readonly userId: string | number;
}
