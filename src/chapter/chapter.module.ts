import { Module } from '@nestjs/common';
import { ChapterService } from './chapter.service';
import { ChapterController } from './chapter.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Chapter } from './chapter.model';
import { Book } from 'src/books/books.model';

@Module({
  providers: [ChapterService],
  controllers: [ChapterController],
  imports: [SequelizeModule.forFeature([Chapter, Book])],
  exports: [ChapterService],
})
export class ChapterModule {}
