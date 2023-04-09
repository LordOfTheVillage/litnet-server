import { Module } from '@nestjs/common';
import { ContestApplicationController } from './contest-application.controller';
import { ContestApplicationService } from './contest-application.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Book } from 'src/books/books.model';
import { Contest } from 'src/contest/models/contest.model';
import { ContestApplication } from './contest-application.model';

@Module({
  controllers: [ContestApplicationController],
  providers: [ContestApplicationService],
  imports: [SequelizeModule.forFeature([Book, Contest, ContestApplication])],
  exports: [ContestApplicationService],
})
export class ContestApplicationModule {}
