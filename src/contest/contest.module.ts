import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Book } from 'src/books/books.model';
import { BooksModule } from 'src/books/books.module';
import { ContestComment } from 'src/contest-comment/contest-comment.model';
import { FileModule } from 'src/file/file.module';
import { Genre } from 'src/genre/genre.model';
import { GenreModule } from 'src/genre/genre.module';
import { User } from 'src/users/user.model';
import { ContestController } from './contest.controller';
import { ContestService } from './contest.service';
import { ContestBook } from './models/contest-book.model';
import { ContestGenre } from './models/contest-genre.model';
import { Contest } from './models/contest.model';

@Module({
  controllers: [ContestController],
  providers: [ContestService],
  imports: [
    SequelizeModule.forFeature([
      Genre,
      Book,
      User,
      Contest,
      ContestGenre,
      ContestBook,
      ContestComment,
    ]),
    FileModule,
    BooksModule,
    GenreModule,
  ],
  exports: [ContestService],
})
export class ContestModule {}
