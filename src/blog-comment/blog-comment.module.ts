import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Blog } from 'src/blog/blog.model';
import { User } from 'src/users/user.model';
import { BlogCommentController } from './blog-comment.controller';
import { BlogComment } from './blog-comment.model';
import { BlogCommentService } from './blog-comment.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [BlogCommentController],
  providers: [BlogCommentService],
  imports: [SequelizeModule.forFeature([Blog, User, BlogComment]), AuthModule],
  exports: [BlogCommentService],
})
export class BlogCommentModule {}
