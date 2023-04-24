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
import { BlogCommentService } from './blog-comment.service';
import { CreateBlogCommentDto } from './dto/create-blog-comment.dto';
import { PatchBlogCommentDto } from './dto/patch-blog-comment.dto';
import { RoleGuard } from 'src/guards/role.guard';
import { Roles } from 'src/auth/roles.decorator';

@Controller('blog-comment')
export class BlogCommentController {
  constructor(private blogCommentService: BlogCommentService) {}

  @Roles('USER', 'ADMIN')
  @UseGuards(RoleGuard)
  @Post()
  create(@Body() dto: CreateBlogCommentDto) {
    return this.blogCommentService.createBlogComment(dto);
  }

  @Get('/:id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.blogCommentService.getBlogCommentById(id);
  }

  @Get()
  getAll(@Query() query: PaginationQueryParams) {
    return this.blogCommentService.getAllBlogComments(query);
  }

  @Roles('USER', 'ADMIN')
  @UseGuards(RoleGuard)
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
    @Query() query: PaginationQueryParams
  ) {
    return this.blogCommentService.getBlogCommentsByBlogId(id, query);
  }

  @Get('/user/:id')
  getByUserId(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: PaginationQueryParams
  ) {
    return this.blogCommentService.getBlogCommentsByUserId(id, query);
  }

  @Delete('/:id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.blogCommentService.deleteBlogComment(id);
  }
}
