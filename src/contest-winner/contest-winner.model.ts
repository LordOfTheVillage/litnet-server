import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Book } from 'src/books/books.model';
import { Contest } from 'src/contest/models/contest.model';

interface ContestWinnerCreationAttrs {
  bookId: number;
  contestId: number;
}

@Table({ tableName: 'contest-winner' })
export class ContestWinner extends Model<
  ContestWinner,
  ContestWinnerCreationAttrs
> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => Contest)
  @Column({ type: DataType.INTEGER, allowNull: false })
  contestId: number;

  @ForeignKey(() => Book)
  @Column({ type: DataType.INTEGER, allowNull: false })
  bookId: number;

  @BelongsTo(() => Contest)
  contest: Contest;

  @BelongsTo(() => Book)
  book: Book;
}
