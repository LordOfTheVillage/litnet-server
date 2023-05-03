import { Controller } from '@nestjs/common';
import { BlogCommentService } from './blog-comment.service';

@Controller('blog-comments')
export class BlogCommentController {
  constructor(private blogCommentService: BlogCommentService) {}
}
