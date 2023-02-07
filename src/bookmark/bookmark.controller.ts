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
import { BookmarkService } from './bookmark.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { PatchBookmarkDto } from './dto/patch-bookmark.dto';

@Controller('bookmark')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}

  @Post()
  create(@Body() dto: CreateBookmarkDto) {
    return this.bookmarkService.createBookmark(dto);
  }

  @Delete('/:id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.bookmarkService.deleteBookmark(id);
  }

  @Get('/:id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.bookmarkService.getById(id);
  }

  @Patch('/:id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: PatchBookmarkDto) {
    return this.bookmarkService.updateBookmark(id, dto);
  }

  @Get('/user/:id')
  getByUserId(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: PaginationQueryParams
  ) {
    return this.bookmarkService.getByUserId(id, query);
  }

  @Get('/book/:id')
  getByBookId(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: PaginationQueryParams
  ) {
    return this.bookmarkService.getByBookId(id, query);
  }

  @Get()
  getAll(@Query() query: PaginationQueryParams) {
    return this.bookmarkService.getAll(query);
  }
}
