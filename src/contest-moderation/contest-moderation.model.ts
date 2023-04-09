import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Contest } from 'src/contest/models/contest.model';
import { User } from 'src/users/user.model';

interface ContestModerationAttrs {
  userId: number;
  contestId: number;
}

@Table({ tableName: 'contest-moderation' })
export class ContestModeration extends Model<
  ContestModeration,
  ContestModerationAttrs
> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  userId: number;

  @ForeignKey(() => Contest)
  @Column({ type: DataType.INTEGER, allowNull: false })
  contestId: number;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Contest)
  contest: Contest;
}
