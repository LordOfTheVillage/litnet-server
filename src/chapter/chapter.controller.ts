import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PaginationQueryParams } from 'src/types/types';
import { ChapterService } from './chapter.service';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { PatchChapterDto } from './dto/patch-chapter.dto';
import { RoleGuard } from 'src/guards/role.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RoleNames } from 'src/constants';

@Controller('chapters')
export class ChapterController {
  constructor(private chapterService: ChapterService) {}

  @Roles(...Object.values(RoleNames))
  @UseGuards(RoleGuard)
  @Post()
  create(@Body() dto: CreateChapterDto) {
    return this.chapterService.createChapter(dto);
  }

  @Get()
  getAll(@Query() query: PaginationQueryParams) {
    return this.chapterService.getAllChapters(query);
  }

  @Get('/:id/pages')
  getPagesByChapterId(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: PaginationQueryParams,
  ) {
    return this.chapterService.getPagesByChapterId(id, query);
  }

  @Get('/:id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.chapterService.getChapterById(id);
  }

  @Roles(...Object.values(RoleNames))
  @UseGuards(RoleGuard)
  @Delete('/:id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.chapterService.deleteChapter(id);
  }

  @Roles(...Object.values(RoleNames))
  @UseGuards(RoleGuard)
  @Patch('/:id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: PatchChapterDto) {
    return this.chapterService.updateChapter(id, dto);
  }
}
