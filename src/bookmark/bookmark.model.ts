import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Book } from 'src/books/books.model';
import { ReadingProgress } from 'src/reading-progress/reading-progress.model';
import { User } from 'src/users/user.model';

interface BookmarkCreationAttrs {
  userId: number;
  bookId: number;
  progressId: number;
}

@Table({ tableName: 'bookmark' })
export class Bookmark extends Model<Bookmark, BookmarkCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => Book)
  @Column({ type: DataType.INTEGER, allowNull: false })
  bookId: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  userId: number;

  @ForeignKey(() => ReadingProgress)
  @Column({ type: DataType.INTEGER, allowNull: false })
  progressId: number;

  @BelongsTo(() => Book)
  book: Book;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => ReadingProgress)
  progress: ReadingProgress;
}
