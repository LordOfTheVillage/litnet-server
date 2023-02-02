import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Chapter } from 'src/chapter/chapter.model';
import { PageController } from './page.controller';
import { Page } from './page.model';
import { PageService } from './page.service';

@Module({
  controllers: [PageController],
  providers: [PageService],
  imports: [SequelizeModule.forFeature([Chapter, Page])],
  exports: [PageService],
})
export class PageModule {}
