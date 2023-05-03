import { Controller } from '@nestjs/common';
import { CommentService } from './comment.service';

@Controller('book-comments')
export class CommentController {
  constructor(private commentService: CommentService) {}
}
