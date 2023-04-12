import { Module } from '@nestjs/common';
import { ContestModerationService } from './contest-moderation.service';
import { ContestModerationController } from './contest-moderation.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/users/user.model';
import { Contest } from 'src/contest/models/contest.model';
import { ContestModeration } from './contest-moderation.model';
import { ModerationGuard } from './moderation.guard';
import { JwtModule } from '@nestjs/jwt';
import { ContestModule } from 'src/contest/contest.module';

@Module({
  providers: [ContestModerationService, ModerationGuard],
  controllers: [ContestModerationController],
  imports: [
    SequelizeModule.forFeature([User, Contest, ContestModeration]),
    JwtModule.register({
      secret: process.env.SECRET_KEY || 'secretKey',
      signOptions: { expiresIn: '24h' },
    }),
    ContestModule,
  ],
  exports: [ContestModerationService, ModerationGuard],
})
export class ContestModerationModule {}
