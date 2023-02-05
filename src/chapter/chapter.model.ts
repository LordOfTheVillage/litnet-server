import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  HasOne,
  Model,
  Table,
} from 'sequelize-typescript';
import { Book } from 'src/books/books.model';
import { Page } from 'src/page/page.model';
import { ReadingProgress } from 'src/reading-progress/reading-progress.model';

interface ChapterCreationAttrs {
  title: string;
  number: number;
  bookId: number;
}

@Table({ tableName: 'chapters' })
export class Chapter extends Model<Chapter, ChapterCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  number: number;

  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @ForeignKey(() => Book)
  @Column({ type: DataType.INTEGER, allowNull: false })
  bookId: number;

  @HasMany(() => Page)
  pages: Page[];

  @HasOne(() => ReadingProgress)
  readingProgress: ReadingProgress;

  @BelongsTo(() => Book)
  book: Book;
}
