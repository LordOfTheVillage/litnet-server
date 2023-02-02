import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('comments')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Post()
  create(@Body() dto: CreateCommentDto) {
    return this.commentService.createComment(dto);
  }

  @Get("/book/:id")
  getByBookId(@Param('id', ParseIntPipe) id: number) {
    return this.commentService.getCommentsByBookId(id);
  }

  @Get("/user/:id")
  getByUserId(@Param('id', ParseIntPipe) id: number) {
    return this.commentService.getCommentsByUserId(id);
  }

}
