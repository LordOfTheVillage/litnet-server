import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Book } from 'src/books/books.model';
import { BookComment } from 'src/comment/comment.model';
import { User } from 'src/users/user.model';
import { RatingController } from './rating.controller';
import { Rating } from './rating.model';
import { RatingService } from './rating.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [RatingController],
  providers: [RatingService],
  imports: [
    SequelizeModule.forFeature([User, Book, Rating, BookComment]),
    AuthModule,
  ],
  exports: [RatingService],
})
export class RatingModule {}
