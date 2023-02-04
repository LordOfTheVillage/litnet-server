import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Blog } from './blog.model';
import { User } from 'src/users/user.model';
import { BlogComment } from 'src/blog-comment/blog-comment.model';

@Module({
  providers: [BlogService],
  controllers: [BlogController],
  imports: [SequelizeModule.forFeature([Blog, User, BlogComment])],
  exports: [BlogService],
})
export class BlogModule {}
