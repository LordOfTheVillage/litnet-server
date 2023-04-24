import { Module } from '@nestjs/common';
import { ContestWinnerService } from './contest-winner.service';
import { ContestWinnerController } from './contest-winner.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Contest } from 'src/contest/models/contest.model';
import { Book } from 'src/books/books.model';
import { ContestWinner } from './contest-winner.model';
import { ContestModule } from 'src/contest/contest.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [ContestWinnerService],
  controllers: [ContestWinnerController],
  imports: [
    SequelizeModule.forFeature([ContestWinner, Book, Contest]),
    AuthModule,
    ContestModule,
  ],
  exports: [ContestWinnerService],
})
export class ContestWinnerModule {}
