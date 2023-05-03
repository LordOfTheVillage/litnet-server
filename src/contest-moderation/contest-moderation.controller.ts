import { Controller } from '@nestjs/common';
import { ContestModerationService } from './contest-moderation.service';

@Controller('contest-moderation')
export class ContestModerationController {
  constructor(private contestModeration: ContestModerationService) {}
}
