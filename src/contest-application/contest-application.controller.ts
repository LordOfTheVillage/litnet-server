import { Controller } from '@nestjs/common';
import { ContestApplicationService } from './contest-application.service';

@Controller('contest-application')
export class ContestApplicationController {
  constructor(private contestApplicationService: ContestApplicationService) {}
}
