import { Module } from '@nestjs/common';
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
import { UsersModule } from 'src/users/users.module';
import { Comment } from 'src/comment/comment.model';
import { ChapterModule } from 'src/chapter/chapter.module';
import { CommentModule } from 'src/comment/comment.module';
import { RatingModule } from 'src/rating/rating.module';

@Module({
  providers: [BooksService],
  controllers: [BooksController],
  imports: [
    SequelizeModule.forFeature([Book, User, Genre, BookGenre, Rating, Comment]),
    GenreModule,
    FileModule,
    UsersModule,
    ChapterModule,
    CommentModule,
    RatingModule,
  ],
})
export class BooksModule {}
