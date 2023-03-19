import { Module } from '@nestjs/common';
import { forwardRef } from '@nestjs/common/utils';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from 'src/auth/auth.module';
import { BlogComment } from 'src/blog-comment/blog-comment.model';
import { Blog } from 'src/blog/blog.model';
import { Bookmark } from 'src/bookmark/bookmark.model';
import { Book } from 'src/books/books.model';
import { ContestComment } from 'src/contest-comment/contest-comment.model';
import { FileModule } from 'src/file/file.module';
import { Rating } from 'src/rating/rating.model';
import { Role } from 'src/role/role.model';
import { RoleModule } from 'src/role/role.module';
import { User } from './user.model';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    SequelizeModule.forFeature([User, Book, Rating, Bookmark, Blog, BlogComment, ContestComment, Role]),
    forwardRef(() => AuthModule),
    FileModule,
    RoleModule
  ],
  exports: [UsersService],
})
export class UsersModule {}
