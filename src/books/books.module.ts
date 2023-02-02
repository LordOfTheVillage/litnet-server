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

@Module({
  providers: [BooksService],
  controllers: [BooksController],
  imports: [
    SequelizeModule.forFeature([Book, User, Genre, BookGenre, Rating]),
    GenreModule,
    FileModule,
    UsersModule,
  ],
})
export class BooksModule {}