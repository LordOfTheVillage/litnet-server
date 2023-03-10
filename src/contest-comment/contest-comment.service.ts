import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PaginationQueryParams } from 'src/types/types';
import { User } from 'src/users/user.model';
import { ContestComment } from './contest-comment.model';
import { CreateContestCommentDto } from './dto/create-contest-comment.dto';
import { PatchContestCommentDto } from './dto/patch-contest-comment.dto';

@Injectable()
export class ContestCommentService {
  private static readonly DEFAULT_LIMIT = 7;
  private static readonly DEFAULT_OFFSET = 0;

  constructor(
    @InjectModel(ContestComment)
    private contestCommentRepository: typeof ContestComment,
  ) {}

  async createComment(dto: CreateContestCommentDto) {
    const suspectComment = await this.contestCommentRepository.findOne({
      where: { contestId: dto.contestId, userId: dto.userId },
    });
    this.checkExistingComment(suspectComment);

    const comment = await this.contestCommentRepository.create(dto);
    return comment;
  }

  async getCommentById(id: number) {
    const comment = await this.contestCommentRepository.findByPk(id, {
      include: { model: User, attributes: ['id', 'name', 'img'] },
    });
    this.validateComment(comment);
    return comment;
  }

  async getCommentsByContestId(
    id: number,
    {
      limit = ContestCommentService.DEFAULT_LIMIT,
      offset = ContestCommentService.DEFAULT_OFFSET,
    }: PaginationQueryParams,
  ) {
    const comments = await this.contestCommentRepository.findAndCountAll({
      where: { contestId: id },
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
      limit = ContestCommentService.DEFAULT_LIMIT,
      offset = ContestCommentService.DEFAULT_OFFSET,
    }: PaginationQueryParams,
  ) {
    const comments = await this.contestCommentRepository.findAndCountAll({
      where: { userId: id },
      distinct: true,
      limit,
      offset,
      include: { model: User, attributes: ['id', 'name', 'img'] },
    });
    return comments;
  }

  async getAllComments({
    limit = ContestCommentService.DEFAULT_LIMIT,
    offset = ContestCommentService.DEFAULT_OFFSET,
  }: PaginationQueryParams) {
    const comments = await this.contestCommentRepository.findAndCountAll({
      distinct: true,
      limit,
      offset,
      include: { model: User, attributes: ['id', 'name', 'img'] },
    });
    return comments;
  }

  async deleteComment(id: number) {
    const comment = await this.contestCommentRepository.findByPk(id);
    await this.validateComment(comment);
    await comment.destroy();
    return comment;
  }

  async updateComment(id: number, dto: PatchContestCommentDto) {
    const comment = await this.contestCommentRepository.findByPk(id);
    await this.validateComment(comment);
    await comment.update(dto);
    return comment;
  }

  private validateComment(comment: ContestComment) {
    if (!comment) {
      throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
    }
  }

  private checkExistingComment(comment: ContestComment) {
    if (comment) {
      throw new HttpException('Comment already exists', HttpStatus.BAD_REQUEST);
    }
  }
}
