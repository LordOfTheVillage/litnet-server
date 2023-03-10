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
} from '@nestjs/common';
import { query } from 'express';
import { PaginationQueryParams } from 'src/types/types';
import { ChapterService } from './chapter.service';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { PatchChapterDto } from './dto/patch-chapter.dto';

@Controller('chapters')
export class ChapterController {
  constructor(private chapterService: ChapterService) {}

  @Post()
  create(@Body() dto: CreateChapterDto) {
    return this.chapterService.createChapter(dto);
  }

  @Get('/book/:id')
  getByBookId(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: PaginationQueryParams,
  ) {
    return this.chapterService.getChaptersByBookId(id, query);
  }

  @Get()
  getAll(@Query() query: PaginationQueryParams) {
    return this.chapterService.getAllChapters(query);
  }

  @Get('/:id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.chapterService.getChapterById(id);
  }

  @Delete('/:id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.chapterService.deleteChapter(id);
  }

  @Patch('/:id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: PatchChapterDto) {
    return this.chapterService.updateChapter(id, dto);
  }
}
