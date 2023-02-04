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
import { BlogCommentService } from './blog-comment.service';
import { CreateBlogCommentDto } from './dto/create-blog-comment.dto';
import { PatchBlogCommentDto } from './dto/patch-blog-comment.dto';

@Controller('blog-comment')
export class BlogCommentController {
  constructor(private blogCommentService: BlogCommentService) {}

  @Post()
  create(@Body() dto: CreateBlogCommentDto) {
    return this.blogCommentService.createBlogComment(dto);
  }

  @Get('/:id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.blogCommentService.getBlogCommentById(id);
  }

  @Get()
  getAll(@Query('limit') limit?: number, @Query('offset') offset?: number) {
    return this.blogCommentService.getAllBlogComments(limit, offset);
  }

  @Patch('/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: PatchBlogCommentDto,
  ) {
    return this.blogCommentService.updateBlogComment(id, dto);
  }

  @Get('/blog/:id')
  getByBlogId(
    @Param('id', ParseIntPipe) id: number,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.blogCommentService.getBlogCommentsByBlogId(id, limit, offset);
  }

  @Get('/user/:id')
  getByUserId(
    @Param('id', ParseIntPipe) id: number,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.blogCommentService.getBlogCommentsByUserId(id, limit, offset);
  }

  @Delete('/:id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.blogCommentService.deleteBlogComment(id);
  }
}
