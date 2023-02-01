import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { BookGenre } from 'src/genre/book-genre.model';
import { Genre } from 'src/genre/genre.model';
import { User } from 'src/users/user.model';

interface BookCreationAttrs {
  name: string;
  email: string;
  password: string;
}

@Table({ tableName: 'books' })
export class Book extends Model<Book, BookCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  title: string;

  @ForeignKey(() => User)
  // @BelongsTo(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  userId: number;

  // @Column({ type: DataType.STRING, unique: true, allowNull: false })
  // genre: string;

  @BelongsToMany(() => Genre, () => BookGenre)
  genres: Genre[];
}
