import { Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ContestWinnerService } from './contest-winner.service';
import { CreateContestWinnerDto } from './dto/create-contest-winner.dto';

@Controller('contest-winner')
export class ContestWinnerController {
  constructor(private contestWinnerService: ContestWinnerService) {}

  @Get('/book/:bookId')
  getByBookId(@Param('bookId', ParseIntPipe) id: number) {
    return this.contestWinnerService.getByBookId(id);
  }

  @Post()
  create(dto: CreateContestWinnerDto) {
    return this.contestWinnerService.createWinner(dto);
  }
}
