import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Book } from 'src/books/books.model';
import { Contest } from './contest.model';

interface ContestBookCreationAttrs {}

@Table({ tableName: 'contest_book', createdAt: false, updatedAt: false })
export class ContestBook extends Model<ContestBook, ContestBookCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => Contest)
  @Column({ type: DataType.INTEGER })
  contestId: number;

  @ForeignKey(() => Book)
  @Column({ type: DataType.INTEGER })
  bookId: number;
}
