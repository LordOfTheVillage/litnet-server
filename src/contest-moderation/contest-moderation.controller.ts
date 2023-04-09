import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ContestModerationService } from './contest-moderation.service';
import { CreateContestModerationDto } from './dto/create-moderation.dto';

@Controller('contest-moderation')
export class ContestModerationController {
  constructor(private contestModeration: ContestModerationService) {}

  @Post()
  create(dto: CreateContestModerationDto) {
    return this.contestModeration.createModeration(dto);
  }

  @Get()
  getAll() {
    return this.contestModeration.getAllModerators();
  }

  @Get('/contest/:contestId')
  getByContestId(@Param('contestId', ParseIntPipe) id: number) {
    return this.contestModeration.getByContestId(id);
  }

  @Get('/user/:userId')
  getByUserId(@Param('userId', ParseIntPipe) id: number) {
    return this.contestModeration.getByUserId(id);
  }


  @Delete('/:id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.contestModeration.deleteModeration(id);
  }
}
