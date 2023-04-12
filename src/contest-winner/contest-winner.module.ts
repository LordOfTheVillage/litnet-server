import { Module } from '@nestjs/common';
import { ContestWinnerService } from './contest-winner.service';
import { ContestWinnerController } from './contest-winner.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Contest } from 'src/contest/models/contest.model';
import { Book } from 'src/books/books.model';
import { ContestWinner } from './contest-winner.model';
import { ContestModule } from 'src/contest/contest.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [ContestWinnerService],
  controllers: [ContestWinnerController],
  imports: [
    SequelizeModule.forFeature([ContestWinner, Book, Contest]),
    JwtModule.register({
      secret: process.env.SECRET_KEY || 'secretKey',
      signOptions: { expiresIn: '24h' },
    }),
    ContestModule,
  ],
  exports: [ContestWinnerService],
})
export class ContestWinnerModule {}
