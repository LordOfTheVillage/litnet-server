import {
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Book } from 'src/books/books.model';
import { Genre } from './genre.model';

interface BookGenreCreationAttrs {
  name: string;
}

@Table({ tableName: 'book_genre', createdAt: false, updatedAt: false })
export class BookGenre extends Model<BookGenre, BookGenreCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => Book)
  @Column({ type: DataType.INTEGER })
  bookId: number;

  @ForeignKey(() => Genre)
  @Column({ type: DataType.INTEGER })
  genreId: number;
}
