import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Book } from 'src/books/books.model';

interface UserCreationAttrs {
  name: string;
  email: string;
  password: string;
  img: string;
}

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({ type: DataType.STRING, unique: true, allowNull: true })
  name: string;

  @Column({ type: DataType.STRING, unique: true, allowNull: true })
  email: string;

  @Column({ type: DataType.STRING, allowNull: true })
  password: string;

  @Column({ type: DataType.STRING })
  img: string;

  @HasMany(() => Book)
  books: Book[];
}
