import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ContestModeration } from './contest-moderation.model';
import { CreateContestModerationDto } from './dto/create-moderation.dto';
import { PaginationQueryParams } from 'src/types/types';
import { User } from 'src/users/user.model';

@Injectable()
export class ContestModerationService {
  private static readonly DEFAULT_LIMIT = undefined;
  private static readonly DEFAULT_OFFSET = undefined;
  constructor(
    @InjectModel(ContestModeration)
    private contestModerationRepository: typeof ContestModeration,
  ) {}

  async createModeration(dto: CreateContestModerationDto) {
    const suspect = await this.contestModerationRepository.findOne({
      where: { userId: dto.userId, contestId: dto.contestId },
    });
    this.checkExisting(suspect);
    return await this.contestModerationRepository.create(dto);
  }

  async deleteModeration(id: number) {
    const moderation = await this.contestModerationRepository.findByPk(id);
    this.checkNotFound(moderation);

    return await moderation.destroy();
  }

  async getByContestId(
    id: number,
    {
      limit = ContestModerationService.DEFAULT_LIMIT,
      offset = ContestModerationService.DEFAULT_OFFSET,
    }: PaginationQueryParams,
  ) {
    const moderations = await this.contestModerationRepository.findAndCountAll({
      where: { contestId: id },
      distinct: true,
      limit,
      offset,
      include: { model: User },
    });

    return moderations;
  }

  async getByUserId(
    id: number,
    {
      limit = ContestModerationService.DEFAULT_LIMIT,
      offset = ContestModerationService.DEFAULT_OFFSET,
    }: PaginationQueryParams,
  ) {
    const moderations = await this.contestModerationRepository.findAndCountAll({
      where: { userId: id },
      distinct: true,
      limit,
      offset,
    });

    return moderations;
  }

  async getByUserAndContestId(userId: number, contestId: number) {
    const moderation = await this.contestModerationRepository.findOne({
      where: { userId, contestId },
    });
    this.checkNotFound(moderation);

    return moderation;
  }

  async getAllModerators({
    limit = ContestModerationService.DEFAULT_LIMIT,
    offset = ContestModerationService.DEFAULT_OFFSET,
  }: PaginationQueryParams) {
    return await this.contestModerationRepository.findAndCountAll({
      distinct: true,
      limit,
      offset,
      include: { model: User, attributes: ['id', 'name'] },
    });
  }

  checkNotFound(suspect: ContestModeration) {
    if (!suspect) throw new NotFoundException('Such moderator was not found');
  }

  checkExisting(suspect: ContestModeration) {
    if (suspect) throw new ConflictException('Such moderator already exists');
  }
}
