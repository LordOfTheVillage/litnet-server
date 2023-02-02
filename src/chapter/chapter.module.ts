import { Module } from '@nestjs/common';
import { ChapterService } from './chapter.service';
import { ChapterController } from './chapter.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Chapter } from './chapter.model';
import { Book } from 'src/books/books.model';
import { Page } from 'src/page/page.model';
import { PageModule } from 'src/page/page.module';

@Module({
  providers: [ChapterService],
  controllers: [ChapterController],
  imports: [SequelizeModule.forFeature([Chapter, Book, Page]), PageModule],
  exports: [ChapterService],
})
export class ChapterModule {}
