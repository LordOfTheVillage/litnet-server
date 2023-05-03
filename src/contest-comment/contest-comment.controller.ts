import { Controller } from '@nestjs/common';
import { ContestCommentService } from './contest-comment.service';

@Controller('contest-comments')
export class ContestCommentController {
  constructor(private contestCommentService: ContestCommentService) {}
}
