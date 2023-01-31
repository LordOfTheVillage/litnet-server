import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Book } from './books.model';
import { User } from 'src/users/user.model';

@Module({
  providers: [BooksService],
  controllers: [BooksController],
  imports: [SequelizeModule.forFeature([Book, User])],
})
export class BooksModule {}
