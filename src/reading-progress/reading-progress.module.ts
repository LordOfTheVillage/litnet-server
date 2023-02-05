import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Bookmark } from 'src/bookmark/bookmark.model';
import { Chapter } from 'src/chapter/chapter.model';
import { Page } from 'src/page/page.model';
import { ReadingProgressController } from './reading-progress.controller';
import { ReadingProgress } from './reading-progress.model';
import { ReadingProgressService } from './reading-progress.service';

@Module({
  controllers: [ReadingProgressController],
  providers: [ReadingProgressService],
  imports: [
    SequelizeModule.forFeature([
      Chapter,
      ReadingProgress,
      Page,
      Bookmark,
      Chapter,
    ]),
  ],
  exports: [ReadingProgressService],
})
export class ReadingProgressModule {}
