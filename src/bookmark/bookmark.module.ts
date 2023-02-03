import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Book } from 'src/books/books.model';
import { ReadingProgress } from 'src/reading-progress/reading-progress.model';
import { ReadingProgressModule } from 'src/reading-progress/reading-progress.module';
import { User } from 'src/users/user.model';
import { BookmarkController } from './bookmark.controller';
import { Bookmark } from './bookmark.model';
import { BookmarkService } from './bookmark.service';

@Module({
  controllers: [BookmarkController],
  providers: [BookmarkService],
  imports: [
    SequelizeModule.forFeature([Book, ReadingProgress, User, Bookmark]),
    ReadingProgressModule,
  ],
  exports: [BookmarkService],
})
export class BookmarkModule {}
