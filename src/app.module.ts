import { Module } from '@nestjs/common';
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
import { BookComment } from './comment/comment.model';
import { ChapterModule } from './chapter/chapter.module';
import { Chapter } from './chapter/chapter.model';
import { PageModule } from './page/page.module';
import { Page } from './page/page.model';
import { ReadingProgressModule } from './reading-progress/reading-progress.module';
import { ReadingProgress } from './reading-progress/reading-progress.model';
import { BookmarkModule } from './bookmark/bookmark.module';
import { Bookmark } from './bookmark/bookmark.model';
import { ContestModule } from './contest/contest.module';
import { Contest } from './contest/models/contest.model';
import { ContestGenre } from './contest/models/contest-genre.model';
import { BlogModule } from './blog/blog.module';
import { BlogCommentModule } from './blog-comment/blog-comment.module';
import { Blog } from './blog/blog.model';
import { BlogComment } from './blog-comment/blog-comment.model';
import { ContestCommentModule } from './contest-comment/contest-comment.module';
import { ContestComment } from './contest-comment/contest-comment.model';
import { RoleModule } from './role/role.module';
import { Role } from './role/role.model';
import { ContestApplicationModule } from './contest-application/contest-application.module';
import { ContestApplication } from './contest-application/contest-application.model';
import { ContestModerationModule } from './contest-moderation/contest-moderation.module';
import { ContestModeration } from './contest-moderation/contest-moderation.model';
import { ContestWinnerModule } from './contest-winner/contest-winner.module';
import { ContestWinner } from './contest-winner/contest-winner.model';
import { ProducerApplicationModule } from './producer-application/producer-application.module';
import { ProducerApplication } from './producer-application/producer-application.model';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, 'static'),
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      dialectOptions: {
        ssl: { rejectUnauthorized: false },
      },
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [
        User,
        Book,
        Genre,
        BookGenre,
        Rating,
        BookComment,
        Chapter,
        Page,
        ReadingProgress,
        Bookmark,
        Contest,
        ContestGenre,
        Blog,
        BlogComment,
        ContestComment,
        Role,
        ContestApplication,
        ContestModeration,
        ContestWinner,
        ProducerApplication,
      ],
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
    PageModule,
    ReadingProgressModule,
    BookmarkModule,
    ContestModule,
    BlogModule,
    BlogCommentModule,
    ContestCommentModule,
    RoleModule,
    ContestApplicationModule,
    ContestModerationModule,
    ContestWinnerModule,
    ProducerApplicationModule,
  ],
})
export class AppModule {}
