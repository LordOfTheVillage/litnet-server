import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Book } from 'src/books/books.model';
import { Rating } from 'src/rating/rating.model';

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

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @Column({ type: DataType.STRING })
  img: string;

  @HasMany(() => Book)
  books: Book[];

  @HasMany(() => Rating)
  ratings: Rating[];
}
