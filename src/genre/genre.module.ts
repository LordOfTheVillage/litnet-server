import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Book } from 'src/books/books.model';
import { BookGenre } from './book-genre.model';
import { GenreController } from './genre.controller';
import { Genre } from './genre.model';
import { GenreService } from './genre.service';

@Module({
  controllers: [GenreController],
  providers: [GenreService],
  imports: [SequelizeModule.forFeature([Genre, Book, BookGenre])],
  exports: [GenreService],
})
export class GenreModule {}
