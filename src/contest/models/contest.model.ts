import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  HasOne,
  Model,
  Table,
} from 'sequelize-typescript';
import { ContestComment } from 'src/contest-comment/contest-comment.model';
import { Genre } from 'src/genre/genre.model';
import { User } from 'src/users/user.model';
import { ContestGenre } from './contest-genre.model';
import { ContestApplication } from 'src/contest-application/contest-application.model';
import { ContestModeration } from 'src/contest-moderation/contest-moderation.model';
import { ContestWinner } from 'src/contest-winner/contest-winner.model';

interface ContestCreationAttrs {
  title: string;
  description: string;
  prize: number;
  img: string;
  date: string;
  userId: number;
  countCharacters: number;
}

@Table({ tableName: 'contest' })
export class Contest extends Model<Contest, ContestCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  title: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  description: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  prize: number;

  @Column({ type: DataType.STRING })
  img: string;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  date: string;

  @Column({ type: DataType.BOOLEAN, allowNull: true, defaultValue: false })
  status: boolean;

  @Column({ type: DataType.INTEGER, allowNull: false })
  countCharacters: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  userId: number;

  @BelongsToMany(() => Genre, () => ContestGenre)
  genres: Genre[];

  @HasMany(() => ContestComment)
  contestComments: ContestComment[];

  @HasMany(() => ContestApplication)
  contestApplications: ContestApplication[];

  @BelongsTo(() => User)
  user: User;

  @HasMany(() => ContestModeration)
  contestModerations: ContestModeration[];

  @HasOne(() => ContestWinner)
  contestWinner: ContestWinner;
}
