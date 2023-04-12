import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ContestModeration } from './contest-moderation.model';
import { CreateContestModerationDto } from './dto/create-moderation.dto';

@Injectable()
export class ContestModerationService {
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

  async getByContestId(id: number) {
    const moderations = await this.contestModerationRepository.findAndCountAll({
      where: { contestId: id },
    });

    return moderations;
  }

  async getByUserId(id: number) {
    const moderations = await this.contestModerationRepository.findAndCountAll({
      where: { userId: id },
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

  async getAllModerators() {
    return await this.contestModerationRepository.findAndCountAll();
  }

  checkNotFound(suspect: ContestModeration) {
    if (!suspect) throw new NotFoundException('Such moderator was not found');
  }

  checkExisting(suspect: ContestModeration) {
    if (suspect) throw new ConflictException('Such moderator already exists');
  }
}
