import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Blog } from './blog.model';
import { User } from 'src/users/user.model';
import { BlogComment } from 'src/blog-comment/blog-comment.model';
import { AuthModule } from 'src/auth/auth.module';
import { BlogCommentModule } from 'src/blog-comment/blog-comment.module';

@Module({
  providers: [BlogService],
  controllers: [BlogController],
  imports: [
    SequelizeModule.forFeature([Blog, User, BlogComment]),
    AuthModule,
    BlogCommentModule,
  ],
  exports: [BlogService],
})
export class BlogModule {}
