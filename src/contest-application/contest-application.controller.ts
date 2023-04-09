import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ContestApplicationService } from './contest-application.service';
import { CreateContestApplicationDto } from './dto/create-contest-application.dto';
import { UpdateContestApplicationDto } from './dto/update-contest-application.dto';

@Controller('contest-application')
export class ContestApplicationController {
  constructor(private contestApplicationService: ContestApplicationService) {}

  @Post()
  create(@Body() dto: CreateContestApplicationDto) {
    return this.contestApplicationService.createApplication(dto);
  }

  @Patch('/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateContestApplicationDto,
  ) {
    return this.contestApplicationService.updateApplication(id, dto);
  }

  @Delete('/:id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.contestApplicationService.deleteApplication(id);
  }

  @Get('/:id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.contestApplicationService.getApplicationById(id);
  }

  @Get('/contest/:contestId')
  getByContestId(@Param('contestId', ParseIntPipe) id: number) {
    return this.contestApplicationService.getApplicationsByContestId(id);
  }

  @Get()
  getAll() {
    return this.contestApplicationService.getAllApplications();
  }
}
