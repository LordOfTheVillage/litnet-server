import { Module } from '@nestjs/common';
import { ProducerApplicationService } from './producer-application.service';
import { ProducerApplicationController } from './producer-application.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/users/user.model';
import { ProducerApplication } from './producer-application.model';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  providers: [ProducerApplicationService],
  controllers: [ProducerApplicationController],
  imports: [
    SequelizeModule.forFeature([User, ProducerApplication]),
    AuthModule,
    UsersModule,
  ],
  exports: [ProducerApplicationService],
})
export class ProducerApplicationModule {}
