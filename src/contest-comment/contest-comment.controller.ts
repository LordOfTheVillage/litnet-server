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
import { ContestCommentService } from './contest-comment.service';
import { CreateContestCommentDto } from './dto/create-contest-comment.dto';
import { PatchContestCommentDto } from './dto/patch-contest-comment.dto';
import { RoleGuard } from 'src/guards/role.guard';
import { Roles } from 'src/auth/roles.decorator';

@Controller('contest-comment')
export class ContestCommentController {
  constructor(private contestCommentService: ContestCommentService) {}

  @Roles('USER', 'ADMIN')
  @UseGuards(RoleGuard)
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

  @Roles('USER', 'ADMIN')
  @UseGuards(RoleGuard)
  @Delete('/:id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.contestCommentService.deleteComment(id);
  }

  @Roles('USER', 'ADMIN')
  @UseGuards(RoleGuard)
  @Patch('/:id')
  update(
    @Body() dto: PatchContestCommentDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.contestCommentService.updateComment(id, dto);
  }
}
