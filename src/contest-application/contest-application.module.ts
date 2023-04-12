import { Module } from '@nestjs/common';
import { ContestApplicationController } from './contest-application.controller';
import { ContestApplicationService } from './contest-application.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Book } from 'src/books/books.model';
import { Contest } from 'src/contest/models/contest.model';
import { ContestApplication } from './contest-application.model';
import { ContestModule } from 'src/contest/contest.module';
import { BooksModule } from 'src/books/books.module';
import { ContestModerationModule } from 'src/contest-moderation/contest-moderation.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [ContestApplicationController],
  providers: [ContestApplicationService],
  imports: [
    SequelizeModule.forFeature([Book, Contest, ContestApplication]),
    ContestModule,
    BooksModule,
    ContestModerationModule,
    JwtModule.register({
      secret: process.env.SECRET_KEY || 'secretKey',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  exports: [ContestApplicationService],
})
export class ContestApplicationModule {}
