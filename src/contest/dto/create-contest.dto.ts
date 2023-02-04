export class CreateContestDto {
  readonly title: string;
  readonly description: string;
  readonly prize: string | number;
  readonly date: string;
  readonly userId: string | number;
  readonly countCharacters: string | number;
  readonly genres: string;
}
