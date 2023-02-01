import { Module } from '@nestjs/common';
import { forwardRef } from '@nestjs/common/utils';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from 'src/auth/auth.module';
import { Book } from 'src/books/books.model';
import { FileModule } from 'src/file/file.module';
import { Rating } from 'src/rating/rating.model';
import { User } from './user.model';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    SequelizeModule.forFeature([User, Book, Rating]),
    forwardRef(() => AuthModule),
    FileModule,
  ],
  exports: [UsersService],
})
export class UsersModule {}
