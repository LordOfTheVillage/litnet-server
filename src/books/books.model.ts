import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Bookmark } from 'src/bookmark/bookmark.model';
import { Chapter } from 'src/chapter/chapter.model';
import { BookComment } from 'src/comment/comment.model';
import { ContestApplication } from 'src/contest-application/contest-application.model';
import { ContestWinner } from 'src/contest-winner/contest-winner.model';
import { BookGenre } from 'src/genre/book-genre.model';
import { Genre } from 'src/genre/genre.model';
import { Rating } from 'src/rating/rating.model';
import { User } from 'src/users/user.model';

interface BookCreationAttrs {
  title: string;
  description: string;
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

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  verified: boolean;

  @Column({ type: DataType.TEXT, allowNull: false })
  description: string;

  @Column(DataType.VIRTUAL)
  get rating() {
    if (!this?.ratings?.length) return '0.00';
    return (
      this.ratings.reduce((acc, rating) => acc + rating.rating, 0) /
      this.ratings.length
    ).toFixed(2);
  }

  @Column({ type: DataType.STRING })
  img: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  userId: number;

  @BelongsToMany(() => Genre, () => BookGenre)
  genres: Genre[];

  @HasMany(() => ContestApplication)
  contestApplications: ContestApplication[];

  @HasMany(() => Rating)
  ratings: Rating[];

  @HasMany(() => BookComment)
  comments: BookComment[];

  @HasMany(() => Chapter)
  chapters: Chapter[];

  @HasMany(() => Bookmark)
  bookmarks: Bookmark[];

  @HasMany(() => ContestWinner)
  contestWinner: ContestWinner;

  @BelongsTo(() => User)
  user: User;
}
