import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Book } from 'src/books/books.model';
import { Rating } from 'src/rating/rating.model';
import { User } from 'src/users/user.model';
import { CommentController } from './comment.controller';
import { Comment } from './comment.model';
import { CommentService } from './comment.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [CommentController],
  providers: [CommentService],
  imports: [
    SequelizeModule.forFeature([User, Book, Comment, Rating]),
    AuthModule,
  ],
  exports: [CommentService],
})
export class CommentModule {}
