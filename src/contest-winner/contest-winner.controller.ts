import { Controller } from '@nestjs/common';
import { ContestWinnerService } from './contest-winner.service';

@Controller('contest-winner')
export class ContestWinnerController {
  constructor(private contestWinnerService: ContestWinnerService) {}
}
