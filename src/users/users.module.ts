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
import { ContestModeration } from 'src/contest-moderation/contest-moderation.model';
import { CommentModule } from 'src/comment/comment.module';
import { BooksModule } from 'src/books/books.module';
import { BookmarkModule } from 'src/bookmark/bookmark.module';
import { BlogCommentModule } from 'src/blog-comment/blog-comment.module';
import { BlogModule } from 'src/blog/blog.module';
import { ContestCommentModule } from 'src/contest-comment/contest-comment.module';
import { RatingModule } from 'src/rating/rating.module';
import { ProducerApplication } from 'src/producer-application/producer-application.model';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    SequelizeModule.forFeature([
      User,
      Book,
      Rating,
      Bookmark,
      Blog,
      BlogComment,
      ContestComment,
      Role,
      ContestModeration,
      ProducerApplication,
    ]),
    forwardRef(() => AuthModule),
    BooksModule,
    FileModule,
    RoleModule,
    CommentModule,
    BlogCommentModule,
    ContestCommentModule,
    BooksModule,
    BookmarkModule,
    BlogModule,
    RatingModule,
  ],
  exports: [UsersService],
})
export class UsersModule {}
