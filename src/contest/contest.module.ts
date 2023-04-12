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
import { ContestGenre } from './models/contest-genre.model';
import { Contest } from './models/contest.model';
import { ContestApplication } from 'src/contest-application/contest-application.model';
import { ContestModeration } from 'src/contest-moderation/contest-moderation.model';
import { ScheduleModule } from '@nestjs/schedule';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [ContestController],
  providers: [ContestService],
  imports: [
    ScheduleModule.forRoot(),
    JwtModule.register({
      secret: process.env.SECRET_KEY || 'secretKey',
      signOptions: { expiresIn: '24h' },
    }),
    SequelizeModule.forFeature([
      Genre,
      Book,
      User,
      Contest,
      ContestGenre,
      ContestComment,
      ContestApplication,
      ContestModeration,
    ]),
    FileModule,
    GenreModule,
  ],
  exports: [ContestService],
})
export class ContestModule {}
