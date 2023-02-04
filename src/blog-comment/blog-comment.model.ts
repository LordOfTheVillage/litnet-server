import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Blog } from 'src/blog/blog.model';
import { User } from 'src/users/user.model';

interface BlogCommentCreationAttrs {
  text: string;
  userId: number;
  blogId: number;
}

@Table({ tableName: 'blog-comments' })
export class BlogComment extends Model<BlogComment, BlogCommentCreationAttrs> {
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

  @ForeignKey(() => Blog)
  @Column({ type: DataType.INTEGER, allowNull: false })
  blogId: number;
}
