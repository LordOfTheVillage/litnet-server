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
import { query } from 'express';
import { PaginationQueryParams } from 'src/types/types';
import { BookmarkService } from './bookmark.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { PatchBookmarkDto } from './dto/patch-bookmark.dto';
import { RoleGuard } from 'src/guards/role.guard';
import { Roles } from 'src/auth/roles.decorator';

@Controller('bookmark')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}

  @Roles('USER', 'ADMIN')
  @UseGuards(RoleGuard)
  @Post()
  create(@Body() dto: CreateBookmarkDto) {
    return this.bookmarkService.createBookmark(dto);
  }

  @Roles('USER', 'ADMIN')
  @UseGuards(RoleGuard)
  @Delete('/:id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.bookmarkService.deleteBookmark(id);
  }

  @Get('/:id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.bookmarkService.getById(id);
  }

  @Roles('USER', 'ADMIN')
  @UseGuards(RoleGuard)
  @Patch('/:id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: PatchBookmarkDto) {
    return this.bookmarkService.updateBookmark(id, dto);
  }

  @Get()
  getAll(@Query() query: PaginationQueryParams) {
    return this.bookmarkService.getAll(query);
  }
}
