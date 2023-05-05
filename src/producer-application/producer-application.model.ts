import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
  Model,
} from 'sequelize-typescript';
import { User } from 'src/users/user.model';

interface ProducerApplicationCreationAttrs {
  userId: number;
  text: string;
}

@Table({ tableName: 'producer-application' })
export class ProducerApplication extends Model<
  ProducerApplication,
  ProducerApplicationCreationAttrs
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

  @Column({ type: DataType.TEXT, allowNull: true })
  text: string;

  @BelongsTo(() => User)
  user: User;
}
