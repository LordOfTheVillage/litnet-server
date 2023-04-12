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
import { ContestApplicationService } from './contest-application.service';
import { CreateContestApplicationDto } from './dto/create-contest-application.dto';
import { UpdateContestApplicationDto } from './dto/update-contest-application.dto';
import { ModerationGuard } from 'src/contest-moderation/moderation.guard';
import { PaginationQueryParams } from 'src/types/types';

@Controller('contest-application')
export class ContestApplicationController {
  constructor(private contestApplicationService: ContestApplicationService) {}

  @Post()
  create(@Body() dto: CreateContestApplicationDto) {
    return this.contestApplicationService.createApplication(dto);
  }

  @UseGuards(ModerationGuard)
  @Patch('/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateContestApplicationDto,
  ) {
    return this.contestApplicationService.updateApplication(id, dto);
  }

  @UseGuards(ModerationGuard)
  @Delete('/:id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.contestApplicationService.deleteApplication(id);
  }

  @Get('/:id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.contestApplicationService.getApplicationById(id);
  }

  @Get('/contest/:contestId')
  getByContestId(
    @Param('contestId', ParseIntPipe) id: number,
    @Query() query: PaginationQueryParams,
  ) {
    return this.contestApplicationService.getApplicationsByContestId(id, query);
  }

  @Get('/contest/:contestId/verified')
  getRealByContestId(
    @Param('contestId', ParseIntPipe) id: number,
    @Query() query: PaginationQueryParams,
  ) {
    return this.contestApplicationService.getRealApplicationsByContestId(
      id,
      query,
    );
  }

  @Get('/contest/:contestId/unverified')
  getUnrealByContestId(
    @Param('contestId', ParseIntPipe) id: number,
    @Query() query: PaginationQueryParams,
  ) {
    return this.contestApplicationService.getUnrealApplicationsByContestId(
      id,
      query,
    );
  }

  @Get()
  getAll(@Query() query: PaginationQueryParams) {
    return this.contestApplicationService.getAllApplications(query);
  }
}
