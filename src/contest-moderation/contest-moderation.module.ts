import { Module } from '@nestjs/common';
import { ContestModerationService } from './contest-moderation.service';
import { ContestModerationController } from './contest-moderation.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/users/user.model';
import { Contest } from 'src/contest/models/contest.model';
import { ContestModeration } from './contest-moderation.model';
import { ModerationGuard } from '../guards/moderation.guard';
import { ContestModule } from 'src/contest/contest.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [ContestModerationService, ModerationGuard],
  controllers: [ContestModerationController],
  imports: [
    SequelizeModule.forFeature([User, Contest, ContestModeration]),
    AuthModule,
    ContestModule,
  ],
  exports: [ContestModerationService, ModerationGuard],
})
export class ContestModerationModule {}
