import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PaginationQueryParams } from 'src/types/types';
import { User } from 'src/users/user.model';
import { Comment } from './comment.model';
import { CreateCommentDto } from './dto/create-comment.dto';
import { PatchCommentDto } from './dto/patch-comment.dto';

@Injectable()
export class CommentService {
  private static readonly DEFAULT_LIMIT = 7;
  private static readonly DEFAULT_OFFSET = 0;
  constructor(
    @InjectModel(Comment) private commentRepository: typeof Comment,
  ) {}

  async createComment(dto: CreateCommentDto) {
    // TODO user and book validation
    const commentByUserId = await this.getCommentByIds(dto.userId, dto.bookId);
    if (commentByUserId) {
      throw new HttpException('Such comment exists', HttpStatus.BAD_REQUEST);
    }
    const comment = await this.commentRepository.create(dto);
    return comment;
  }

  async getCommentsByBookId(
    id: number,
    {
      limit = CommentService.DEFAULT_LIMIT,
      offset = CommentService.DEFAULT_OFFSET,
    }: PaginationQueryParams,
  ) {
    const comments = await this.commentRepository.findAndCountAll({
      where: { bookId: id },
      distinct: true,
      limit,
      offset,
      include: { model: User, attributes: ['id', 'name', 'img'] },
    });
    return comments;
  }

  async getCommentsByUserId(
    id: number,
    {
      limit = CommentService.DEFAULT_LIMIT,
      offset = CommentService.DEFAULT_OFFSET,
    }: PaginationQueryParams,
  ) {
    const comments = await this.commentRepository.findAndCountAll({
      where: { userId: id },
      distinct: true,
      limit,
      offset,
      include: { model: User, attributes: ['id', 'name', 'img'] },
    });
    return comments;
  }

  async getCommentByIds(userId: number, bookId: number) {
    const comment = await this.commentRepository.findOne({
      where: { userId, bookId },
    });
    return comment;
  }

  async getCommentById(id: number) {
    const comment = await this.commentRepository.findByPk(id, {
      include: { model: User, attributes: ['id', 'name', 'img'] },
    });
    this.validateComment(comment);
    return comment;
  }

  async getAllComments({
    limit = CommentService.DEFAULT_LIMIT,
    offset = CommentService.DEFAULT_OFFSET,
  }: PaginationQueryParams) {
    const comments = await this.commentRepository.findAndCountAll({
      distinct: true,
      limit,
      offset,
      include: { model: User, attributes: ['id', 'name', 'img'] },
    });
    return comments;
  }

  async deleteComment(id: number) {
    const comment = await this.commentRepository.findByPk(id);
    this.validateComment(comment);
    await comment.destroy();
    return comment;
  }

  async updateComment(dto: PatchCommentDto, id: number) {
    const comment = await this.commentRepository.findByPk(id);
    this.validateComment(comment);
    await comment.update(dto);
    return comment;
  }

  private validateComment(comment: Comment) {
    if (!comment) {
      throw new HttpException(
        { message: 'Such comment does not exist' },
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
