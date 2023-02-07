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
import { ContestCommentService } from './contest-comment.service';
import { CreateContestCommentDto } from './dto/create-contest-comment.dto';
import { PatchContestCommentDto } from './dto/patch-contest-comment.dto';

@Controller('contest-comment')
export class ContestCommentController {
  constructor(private contestCommentService: ContestCommentService) {}

  @Post()
  create(@Body() dto: CreateContestCommentDto) {
    return this.contestCommentService.createComment(dto);
  }

  @Get('/contest/:id')
  getByContestId(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: PaginationQueryParams,
  ) {
    return this.contestCommentService.getCommentsByContestId(id, query);
  }

  @Get('/user/:id')
  getByUserId(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: PaginationQueryParams,
  ) {
    return this.contestCommentService.getCommentsByUserId(id, query);
  }

  @Get()
  getAll(@Query() query: PaginationQueryParams) {
    return this.contestCommentService.getAllComments(query);
  }

  @Get('/:id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.contestCommentService.getCommentById(id);
  }

  @Delete('/:id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.contestCommentService.deleteComment(id);
  }

  @Patch('/:id')
  update(
    @Body() dto: PatchContestCommentDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.contestCommentService.updateComment(id, dto);
  }
}
