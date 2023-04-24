import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ContestModerationService } from './contest-moderation.service';
import { CreateContestModerationDto } from './dto/create-moderation.dto';
import { ContestOwnerGuard } from 'src/guards/contest-owner.guard';
import { PaginationQueryParams } from 'src/types/types';

@Controller('contest-moderation')
export class ContestModerationController {
  constructor(private contestModeration: ContestModerationService) {}

  @UseGuards(ContestOwnerGuard)
  @Post()
  create(@Body() dto: CreateContestModerationDto) {
    return this.contestModeration.createModeration(dto);
  }

  @Get()
  getAll(@Query() query: PaginationQueryParams) {
    return this.contestModeration.getAllModerators(query);
  }

  @Get('/contest/:contestId')
  getByContestId(
    @Param('contestId', ParseIntPipe) id: number,
    @Query() query: PaginationQueryParams,
  ) {
    return this.contestModeration.getByContestId(id, query);
  }

  @Get('/user/:userId')
  getByUserId(
    @Param('userId', ParseIntPipe) id: number,
    @Query() query: PaginationQueryParams,
  ) {
    return this.contestModeration.getByUserId(id, query);
  }

  @UseGuards(ContestOwnerGuard)
  @Delete('/:id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.contestModeration.deleteModeration(id);
  }
}
