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
import { PaginationQueryParams, SearchQueryParams } from 'src/types/types';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { PatchBlogDto } from './dto/patch-blog.dto';
import { RoleGuard } from 'src/guards/role.guard';
import { Roles } from 'src/auth/roles.decorator';
import { PatchBlogCommentDto } from 'src/blog-comment/dto/patch-blog-comment.dto';
import { CreateBlogCommentDto } from 'src/blog-comment/dto/create-blog-comment.dto';
import { RoleNames } from 'src/constants';

@Controller('blog')
export class BlogController {
  constructor(private blogService: BlogService) {}

  @Roles(...Object.values(RoleNames))
  @UseGuards(RoleGuard)
  @Post()
  create(@Body() dto: CreateBlogDto) {
    return this.blogService.createBlog(dto);
  }

  @Get('/:id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.blogService.getBlogById(id);
  }

  @Roles(...Object.values(RoleNames))
  @UseGuards(RoleGuard)
  @Post('/:id/comments')
  createBlogComment(@Body() dto: CreateBlogCommentDto) {
    return this.blogService.createBlogComment(dto);
  }

  @Get('/:blogId/comments/:id')
  getBlogCommentById(@Param('id', ParseIntPipe) id: number) {
    return this.blogService.getBlogCommentById(id);
  }

  @Get('/:id/comments')
  getBlogCommentsByBlogId(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: PaginationQueryParams,
  ) {
    return this.blogService.getBlogCommentsByBlogId(id, query);
  }

  @Roles(...Object.values(RoleNames))
  @UseGuards(RoleGuard)
  @Patch('/:blogId/comments/:id')
  updateBlogComment(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: PatchBlogCommentDto,
  ) {
    return this.blogService.updateBlogComment(id, dto);
  }

  @Delete('/:blogId/comments/:id')
  deleteBlogComment(@Param('id', ParseIntPipe) id: number) {
    return this.blogService.deleteBlogComment(id);
  }

  @Get()
  getAll(@Query() query: SearchQueryParams) {
    return this.blogService.getAllBlogs(query);
  }

  @Roles(...Object.values(RoleNames))
  @UseGuards(RoleGuard)
  @Patch('/:id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: PatchBlogDto) {
    return this.blogService.updateBlog(id, dto);
  }

  @Roles(...Object.values(RoleNames))
  @UseGuards(RoleGuard)
  @Delete('/:id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.blogService.deleteBlog(id);
  }
}
