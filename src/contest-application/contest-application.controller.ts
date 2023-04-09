import { Body, Controller, Post } from '@nestjs/common';
import { ContestApplicationService } from './contest-application.service';
import { CreateContestApplicationDto } from './dto/create-contest-application.dto';

@Controller('contest-application')
export class ContestApplicationController {
  constructor(private contestApplicationService: ContestApplicationService) {}

  @Post()
  create(@Body() dto: CreateContestApplicationDto) {
    return this.contestApplicationService.createApplication(dto);
  }

  
}
