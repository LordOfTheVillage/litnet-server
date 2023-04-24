import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Book } from 'src/books/books.model';
import { ContestGenre } from 'src/contest/models/contest-genre.model';
import { Contest } from 'src/contest/models/contest.model';
import { BookGenre } from './book-genre.model';
import { GenreController } from './genre.controller';
import { Genre } from './genre.model';
import { GenreService } from './genre.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [GenreController],
  providers: [GenreService],
  imports: [
    SequelizeModule.forFeature([Genre, Book, BookGenre, Contest, ContestGenre]),
    AuthModule,
  ],
  exports: [GenreService],
})
export class GenreModule {}
