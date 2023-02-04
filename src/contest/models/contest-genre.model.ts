import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Genre } from 'src/genre/genre.model';
import { Contest } from './contest.model';

interface ContestGenreCreationAttrs {}

@Table({ tableName: 'contest_genre', createdAt: false, updatedAt: false })
export class ContestGenre extends Model<
  ContestGenre,
  ContestGenreCreationAttrs
> {
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

  @ForeignKey(() => Genre)
  @Column({ type: DataType.INTEGER })
  genreId: number;
}
