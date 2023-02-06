import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/users/user.model';
import { ContestComment } from './contest-comment.model';
import { CreateContestCommentDto } from './dto/create-contest-comment.dto';
import { PatchContestCommentDto } from './dto/patch-contest-comment.dto';

@Injectable()
export class ContestCommentService {
  constructor(
    @InjectModel(ContestComment)
    private contestCommentRepository: typeof ContestComment,
  ) {}

  async createComment(dto: CreateContestCommentDto) {
    const suspectComment = await this.contestCommentRepository.findOne({
      where: { contestId: dto.contestId, userId: dto.userId },
    });
    await this.checkExistingComment(suspectComment);

    const comment = await this.contestCommentRepository.create(dto);
    return comment;
  }

  async getCommentById(id: number) {
    const comment = await this.contestCommentRepository.findByPk(id, {
      include: { model: User, attributes: ['id', 'name', 'img'] },
    });
    await this.validateComment(comment);
    return comment;
  }

  async getCommentsByContestId(id: number, limit: number, offset: number) {
    const comments = await this.contestCommentRepository.findAll({
      where: { contestId: id },
      limit: limit || undefined,
      offset: offset || undefined,
      include: { model: User, attributes: ['id', 'name', 'img'] },
    });
    return comments;
  }

  async getCommentsByUserId(id: number, limit: number, offset: number) {
    const comments = await this.contestCommentRepository.findAll({
      where: { userId: id },
      limit: limit || undefined,
      offset: offset || undefined,
      include: { model: User, attributes: ['id', 'name', 'img'] },
    });
    return comments;
  }

  async getAllComments(limit: number, offset: number) {
    const comments = await this.contestCommentRepository.findAll({
      limit: limit || undefined,
      offset: offset || undefined,
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

  private async validateComment(comment: ContestComment) {
    if (!comment) {
      throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
    }
  }

  private async checkExistingComment(comment: ContestComment) {
    if (comment) {
      throw new HttpException('Comment already exists', HttpStatus.BAD_REQUEST);
    }
  }
}
