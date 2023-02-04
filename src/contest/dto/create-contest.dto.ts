export class CreateContestDto {
  title: string;
  description: string;
  prize: string | number;
  date: string;
  userId: string | number;
  countCharacters: string | number;
  genres: string;
}
