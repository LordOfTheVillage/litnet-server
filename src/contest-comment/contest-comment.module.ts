import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Contest } from 'src/contest/models/contest.model';
import { User } from 'src/users/user.model';
import { ContestCommentController } from './contest-comment.controller';
import { ContestComment } from './contest-comment.model';
import { ContestCommentService } from './contest-comment.service';

@Module({
  controllers: [ContestCommentController],
  providers: [ContestCommentService],
  imports: [SequelizeModule.forFeature([User, Contest, ContestComment])],
  exports: [ContestCommentService],
})
export class ContestCommentModule {}
