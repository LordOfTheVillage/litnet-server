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
import { PaginationQueryParams } from 'src/types/types';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { PatchBlogDto } from './dto/patch-blog.dto';

@Controller('blog')
export class BlogController {
  constructor(private blogService: BlogService) {}

  @Post()
  create(@Body() dto: CreateBlogDto) {
    return this.blogService.createBlog(dto);
  }

  @Get('/:id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.blogService.getBlogById(id);
  }

  @Get()
  getAll(@Query() query: PaginationQueryParams) {
    return this.blogService.getAllBlogs(query);
  }

  @Get('/user/:id')
  getByUserId(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: PaginationQueryParams,
  ) {
    return this.blogService.getBlogsByUserId(id, query);
  }

  @Patch('/:id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: PatchBlogDto) {
    return this.blogService.updateBlog(id, dto);
  }

  @Delete('/:id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.blogService.deleteBlog(id);
  }
}
