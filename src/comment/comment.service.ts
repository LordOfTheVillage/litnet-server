import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Comment } from './comment.model';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment) private commentRepository: typeof Comment,
  ) {}

  async createComment(dto: CreateCommentDto) {
    const commentByUserId = await this.getCommentByIds(dto.userId, dto.bookId);
    if (commentByUserId) {
      throw new HttpException('Such comment exists', HttpStatus.BAD_REQUEST);
    }
    console.log(dto)
    const comment = await this.commentRepository.create(dto);
    return comment;
  }

  async getCommentsByBookId(id: number) {
    const comments = await this.commentRepository.findAll({
      where: { bookId: id },
    });
    return comments;
  }

  async getCommentsByUserId(id: number) {
    const comments = await this.commentRepository.findAll({
      where: { userId: id },
    });
    return comments;
  }

  async getCommentByIds(userId: number, bookId: number) {
    const comment = await this.commentRepository.findOne({
      where: { userId, bookId },
    });
    return comment;
  }

  async getAllComments() {
    const comments = await this.commentRepository.findAll();
    return comments;
  }
}
