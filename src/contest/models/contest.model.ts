import {
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Book } from 'src/books/books.model';
import { ContestComment } from 'src/contest-comment/contest-comment.model';
import { Genre } from 'src/genre/genre.model';
import { User } from 'src/users/user.model';
import { ContestBook } from './contest-book.model';
import { ContestGenre } from './contest-genre.model';

interface ContestCreationAttrs {
  title: string;
  description: string;
  prize: number;
  img: string;
  date: string;
  userId: number;
  countCharacters: number;
}

@Table({ tableName: 'contest' })
export class Contest extends Model<Contest, ContestCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  title: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  description: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  prize: number;

  @Column({ type: DataType.STRING })
  img: string;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  date: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  countCharacters: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  userId: number;

  @BelongsToMany(() => Genre, () => ContestGenre)
  genres: Genre[];

  @BelongsToMany(() => Book, () => ContestBook)
  books: Book[];

  @HasMany(() => ContestComment)
  contestComments: ContestComment[];
}
