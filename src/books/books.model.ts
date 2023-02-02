import {
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Chapter } from 'src/chapter/chapter.model';
import { Comment } from 'src/comment/comment.model';
import { BookGenre } from 'src/genre/book-genre.model';
import { Genre } from 'src/genre/genre.model';
import { Rating } from 'src/rating/rating.model';
import { User } from 'src/users/user.model';

interface BookCreationAttrs {
  title: string;
  img: string;
  userId: number;
  genres: string[];
}

@Table({ tableName: 'books' })
export class Book extends Model<Book, BookCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  title: string;

  @Column({ type: DataType.STRING })
  img: string;

  @ForeignKey(() => User)
  // @BelongsTo(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  userId: number;

  @BelongsToMany(() => Genre, () => BookGenre)
  genres: Genre[];

  @HasMany(() => Rating)
  ratings: Rating[];

  @HasMany(() => Comment)
  comments: Comment[];

  @HasMany(() => Chapter)
  chapters: Chapter[];
}
