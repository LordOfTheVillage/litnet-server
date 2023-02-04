import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { Book } from 'src/books/books.model';
import { ContestGenre } from 'src/contest/models/contest-genre.model';
import { Contest } from 'src/contest/models/contest.model';
import { BookGenre } from './book-genre.model';

interface GenreCreationAttrs {
  name: string;
}

@Table({ tableName: 'genres' })
export class Genre extends Model<Genre, GenreCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  name: string;

  @BelongsToMany(() => Book, () => BookGenre)
  books: Book[];

  @BelongsToMany(() => Contest, () => ContestGenre)
  contests: Contest[];
}
