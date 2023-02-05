import {
  Column,
  DataType,
  ForeignKey,
  HasOne,
  Model,
  Table,
} from 'sequelize-typescript';
import { Bookmark } from 'src/bookmark/bookmark.model';
import { Chapter } from 'src/chapter/chapter.model';
import { Page } from 'src/page/page.model';

interface ReadingProgressCreationAttrs {
  chapterId: number;
  pageId: number;
}

@Table({ tableName: 'readingProgress' })
export class ReadingProgress extends Model<
  ReadingProgress,
  ReadingProgressCreationAttrs
> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => Chapter)
  @Column({ type: DataType.INTEGER, allowNull: false })
  chapterId: number;

  @ForeignKey(() => Page)
  @Column({ type: DataType.INTEGER, allowNull: false })
  pageId: number;
}
