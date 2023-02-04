import {
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { BlogComment } from 'src/blog-comment/blog-comment.model';
import { User } from 'src/users/user.model';

interface BlogCreationAttrs {
  title: string;
  text: string;
  userId: number;
}

@Table({ tableName: 'blogs' })
export class Blog extends Model<Blog, BlogCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({ type: DataType.TEXT })
  text: string;

  @Column({ type: DataType.STRING })
  title: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  userId: number;

  @HasMany(() => BlogComment)
  blogComments: BlogComment[];
}
