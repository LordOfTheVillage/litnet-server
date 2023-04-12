import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { ContestWinnerService } from './contest-winner.service';
import { CreateContestWinnerDto } from './dto/create-contest-winner.dto';
import { ContestOwnerGuard } from 'src/contest/contest-owner.guard';

@Controller('contest-winner')
export class ContestWinnerController {
  constructor(private contestWinnerService: ContestWinnerService) {}

  @Get('/book/:bookId')
  getByBookId(@Param('bookId', ParseIntPipe) id: number) {
    return this.contestWinnerService.getByBookId(id);
  }

  @UseGuards(ContestOwnerGuard)
  @Post()
  create(@Body() dto: CreateContestWinnerDto) {
    return this.contestWinnerService.createWinner(dto);
  }
}
