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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PaginationQueryParams } from 'src/types/types';
import { ContestService } from './contest.service';
import { CreateContestDto } from './dto/create-contest.dto';
import { PatchContestDto } from './dto/patch-contest.dto';
import { ContestOwnerGuard } from './contest-owner.guard';

@Controller('contest')
export class ContestController {
  constructor(private contestService: ContestService) {}

  @Post()
  @UseInterceptors(FileInterceptor('img'))
  create(
    @Body() contestDto: CreateContestDto,
    @UploadedFile() img?: Express.Multer.File,
  ) {
    return this.contestService.createContest(contestDto, img);
  }

  @Get('/:id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.contestService.getContestById(id);
  }

  @Get('/user/:id')
  getAllByUser(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: PaginationQueryParams,
  ) {
    return this.contestService.getContestsByUserId(id, query);
  }

  @Get()
  getAll(@Query() query: PaginationQueryParams) {
    return this.contestService.getAllContests(query);
  }

  @Patch('/:id')
  @UseInterceptors(FileInterceptor('img'))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() contestDto: PatchContestDto,
    @UploadedFile() img?: Express.Multer.File,
  ) {
    return this.contestService.updateContest(contestDto, id, img);
  }

  @UseGuards(ContestOwnerGuard)
  @Delete('/:id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.contestService.deleteContest(id);
  }
}
