import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './users/user.model';
import { UsersModule } from './users/users.module';
import { BooksModule } from './books/books.module';
import { Book } from './books/books.model';
import { AuthModule } from './auth/auth.module';
import { FileModule } from './file/file.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { GenreModule } from './genre/genre.module';
import * as path from 'path';
import { Genre } from './genre/genre.model';
import { BookGenre } from './genre/book-genre.model';
import { RatingModule } from './rating/rating.module';
import { Rating } from './rating/rating.model';
import { CommentModule } from './comment/comment.module';
import { Comment } from './comment/comment.model';
import { ChapterModule } from './chapter/chapter.module';
import { Chapter } from './chapter/chapter.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, 'static'),
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [User, Book, Genre, BookGenre, Rating, Comment, Chapter],
      autoLoadModels: true,
      synchronize: true,
    }),
    UsersModule,
    BooksModule,
    AuthModule,
    FileModule,
    GenreModule,
    RatingModule,
    CommentModule,
    ChapterModule,
  ],
})
export class AppModule {}
