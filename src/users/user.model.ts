import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  HasOne,
  Model,
  Table,
} from 'sequelize-typescript';
import { BlogComment } from 'src/blog-comment/blog-comment.model';
import { Blog } from 'src/blog/blog.model';
import { Bookmark } from 'src/bookmark/bookmark.model';
import { Book } from 'src/books/books.model';
import { Comment } from 'src/comment/comment.model';
import { ContestComment } from 'src/contest-comment/contest-comment.model';
import { Contest } from 'src/contest/models/contest.model';
import { Rating } from 'src/rating/rating.model';
import { Role } from 'src/role/role.model';

interface UserCreationAttrs {
  name: string;
  email: string;
  password: string;
  img: string;
  roleId: number;
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

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @Column({ type: DataType.STRING, defaultValue: 'pages' })
  readingView: string;

  @Column({ type: DataType.TEXT, defaultValue: '' })
  autobiography: string;

  @Column({ type: DataType.STRING })
  img: string;

  @ForeignKey(() => Contest)
  @Column({ type: DataType.INTEGER })
  contestId: number;

  @ForeignKey(() => Role)
  @Column({ type: DataType.INTEGER, allowNull: false })
  roleId: number;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  banned: boolean;

  @Column({ type: DataType.TEXT, allowNull: true })
  banReason: string;

  @BelongsTo(() => Role)
  role: Role;

  @HasOne(() => Contest)
  contest: Contest;

  @HasMany(() => Book)
  books: Book[];

  @HasMany(() => Rating)
  ratings: Rating[];

  @HasMany(() => Comment)
  bookComments: Comment[];

  @HasMany(() => Bookmark)
  bookmarks: Bookmark[];

  @HasMany(() => Blog)
  blogs: Blog[];

  @HasMany(() => BlogComment)
  blogComments: BlogComment[];

  @HasMany(() => ContestComment)
  contestComments: ContestComment[];
}
