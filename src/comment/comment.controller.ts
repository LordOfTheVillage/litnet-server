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
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { PatchCommentDto } from './dto/patch-comment.dto';
import { Roles } from 'src/auth/roles.decorator';
import { RoleGuard } from 'src/guards/role.guard';

@Controller('book-comments')
export class CommentController {
  constructor(private commentService: CommentService) {}
}
