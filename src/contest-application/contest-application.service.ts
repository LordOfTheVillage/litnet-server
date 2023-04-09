import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateContestApplicationDto } from './dto/create-contest-application.dto';
import { InjectModel } from '@nestjs/sequelize';
import { ContestApplication } from './contest-application.model';
import { UpdateContestApplicationDto } from './dto/update-contest-application.dto';

@Injectable()
export class ContestApplicationService {
  constructor(
    @InjectModel(ContestApplication)
    private contestApplicationRepository: typeof ContestApplication,
  ) {}

  async createApplication(dto: CreateContestApplicationDto) {
    const suspect = await this.contestApplicationRepository.findOne({
      where: { contestId: dto.contestId, bookId: dto.bookId },
    });
    this.checkExisting(suspect);

    return await this.contestApplicationRepository.create(dto);
  }

  async updateApplication(id: number, dto: UpdateContestApplicationDto) {
    const application = await this.contestApplicationRepository.findByPk(id);
    this.checkNotFound(application);

    return await application.update(dto);
  }

  async deleteApplication(id: number) {
    const application = await this.contestApplicationRepository.findByPk(id);
    this.checkNotFound(application);

    return await application.destroy();
  }

  async getApplicationById(id: number) {
    const application = await this.contestApplicationRepository.findByPk(id);
    this.checkNotFound(application);

    return application;
  }

  async getApplicationsByContestId(id: number) {
    return await this.contestApplicationRepository.findAndCountAll({
      where: { contestId: id },
    });
  }

  async getAllApplications() {
    return await this.contestApplicationRepository.findAndCountAll();
  }

  checkNotFound(suspect: ContestApplication) {
    if (!suspect) throw new NotFoundException('Such application was not found');
  }

  checkExisting(suspect: ContestApplication) {
    if (suspect) throw new ConflictException('Such application already exists');
  }
}
