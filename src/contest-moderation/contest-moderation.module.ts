import { Module } from '@nestjs/common';
import { ContestModerationService } from './contest-moderation.service';
import { ContestModerationController } from './contest-moderation.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/users/user.model';
import { Contest } from 'src/contest/models/contest.model';
import { ContestModeration } from './contest-moderation.model';
import { ModerationGuard } from '../guards/moderation.guard';

@Module({
  providers: [ContestModerationService],
  controllers: [ContestModerationController],
  imports: [SequelizeModule.forFeature([User, Contest, ContestModeration])],
  exports: [ContestModerationService],
})
export class ContestModerationModule {}
