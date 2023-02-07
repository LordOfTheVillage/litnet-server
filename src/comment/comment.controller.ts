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
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { PatchCommentDto } from './dto/patch-comment.dto';

@Controller('book-comments')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Post()
  create(@Body() dto: CreateCommentDto) {
    return this.commentService.createComment(dto);
  }

  @Get('/book/:id')
  getByBookId(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: PaginationQueryParams,
  ) {
    return this.commentService.getCommentsByBookId(id, query);
  }

  @Get('/user/:id')
  getByUserId(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: PaginationQueryParams,
  ) {
    return this.commentService.getCommentsByUserId(id, query);
  }

  @Get()
  getAll(@Query() query: PaginationQueryParams) {
    return this.commentService.getAllComments(query);
  }

  @Get('/:id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.commentService.getCommentById(id);
  }

  @Delete('/:id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.commentService.deleteComment(id);
  }

  @Patch('/:id')
  update(@Body() dto: PatchCommentDto, @Param('id', ParseIntPipe) id: number) {
    return this.commentService.updateComment(dto, id);
  }
}
