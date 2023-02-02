import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Chapter } from 'src/chapter/chapter.model';

interface PageCreationAttrs {
  text: string;
  number: number;
  chapterId: number;
}

@Table({ tableName: 'page' })
export class Page extends Model<Page, PageCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  number: number;

  @Column({ type: DataType.TEXT, allowNull: false })
  text: string;

  @ForeignKey(() => Chapter)
  @Column({ type: DataType.INTEGER, allowNull: false })
  chapterId: number;
}
