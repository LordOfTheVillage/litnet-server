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
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.commentService.getCommentsByBookId(id, limit, offset);
  }

  @Get('/user/:id')
  getByUserId(
    @Param('id', ParseIntPipe) id: number,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.commentService.getCommentsByUserId(id, limit, offset);
  }

  @Get()
  getAll(@Query('limit') limit?: number, @Query('offset') offset?: number) {
    return this.commentService.getAllComments(limit, offset);
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
