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

@Controller('blog-comments')
export class BlogCommentController {
  constructor(private blogCommentService: BlogCommentService) {}
}
