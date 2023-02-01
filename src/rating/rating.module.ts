import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Book } from 'src/books/books.model';
import { User } from 'src/users/user.model';
import { RatingController } from './rating.controller';
import { Rating } from './rating.model';
import { RatingService } from './rating.service';

@Module({
  controllers: [RatingController],
  providers: [RatingService],
  imports: [SequelizeModule.forFeature([User, Book, Rating])],
  exports: [RatingService],
})
export class RatingModule {}
