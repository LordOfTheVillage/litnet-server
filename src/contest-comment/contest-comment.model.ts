import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Contest } from 'src/contest/models/contest.model';
import { User } from 'src/users/user.model';

interface ContestCommentCreationAttrs {
  text: string;
  userId: number;
  contestId: number;
}

@Table({ tableName: 'contest-comments' })
export class ContestComment extends Model<
  ContestComment,
  ContestCommentCreationAttrs
> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({ type: DataType.TEXT, allowNull: true })
  text: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  userId: number;

  @ForeignKey(() => Contest)
  @Column({ type: DataType.INTEGER, allowNull: false })
  contestId: number;
}
