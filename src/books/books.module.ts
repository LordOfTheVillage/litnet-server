import { Module, forwardRef } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Book } from './books.model';
import { User } from 'src/users/user.model';
import { Genre } from 'src/genre/genre.model';
import { BookGenre } from 'src/genre/book-genre.model';
import { GenreModule } from 'src/genre/genre.module';
import { FileModule } from 'src/file/file.module';
import { Rating } from 'src/rating/rating.model';
import { BookComment } from 'src/comment/comment.model';
import { ChapterModule } from 'src/chapter/chapter.module';
import { CommentModule } from 'src/comment/comment.module';
import { RatingModule } from 'src/rating/rating.module';
import { Bookmark } from 'src/bookmark/bookmark.model';
import { AuthModule } from 'src/auth/auth.module';
import { ContestApplication } from 'src/contest-application/contest-application.model';
import { ContestWinnerModule } from 'src/contest-winner/contest-winner.module';
import { BookmarkModule } from 'src/bookmark/bookmark.module';

@Module({
  providers: [BooksService],
  controllers: [BooksController],
  imports: [
    SequelizeModule.forFeature([
      Book,
      User,
      Genre,
      BookGenre,
      Rating,
      BookComment,
      Bookmark,
      ContestApplication,
    ]),
    GenreModule,
    FileModule,
    ChapterModule,
    CommentModule,
    RatingModule,
    AuthModule,
    ContestWinnerModule,
    BookmarkModule,
  ],
  exports: [BooksService],
})
export class BooksModule {}
