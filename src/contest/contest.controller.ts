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
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ContestService } from './contest.service';
import { CreateContestDto } from './dto/create-contest.dto';
import { PatchContestDto } from './dto/patch-contest.dto';

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

  @Post('/:contestId/addBook/:bookId')
  addBook(
    @Param('contestId', ParseIntPipe) contestId: number,
    @Param('bookId', ParseIntPipe) bookId: number,
  ) {
    return this.contestService.addBook(contestId, bookId);
  }

  @Delete('/:contestId/removeBook/:bookId')
  removeBook(
    @Param('contestId', ParseIntPipe) contestId: number,
    @Param('bookId', ParseIntPipe) bookId: number,
  ) {
    return this.contestService.removeBook(contestId, bookId);
  }

  @Get('/:id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.contestService.getContestById(id);
  }

  @Get('/user/:id')
  getAllByUser(
    @Param('id', ParseIntPipe) id: number,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.contestService.getContestsByUserId(id, limit, offset);
  }

  @Get()
  getAll(@Query('limit') limit?: number, @Query('offset') offset?: number) {
    return this.contestService.getAllContests(limit, offset);
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

  @Delete('/:id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.contestService.deleteContest(id);
  }
}
