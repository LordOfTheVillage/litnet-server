import {
  ConflictException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { CreateContestApplicationDto } from './dto/create-contest-application.dto';
import { InjectModel } from '@nestjs/sequelize';
import { ContestApplication } from './contest-application.model';
import { UpdateContestApplicationDto } from './dto/update-contest-application.dto';
import { ContestService } from 'src/contest/contest.service';
import { BooksService } from 'src/books/books.service';
import { PaginationQueryParams } from 'src/types/types';

@Injectable()
export class ContestApplicationService {
  private static readonly DEFAULT_LIMIT = undefined;
  private static readonly DEFAULT_OFFSET = undefined;
  constructor(
    @InjectModel(ContestApplication)
    private contestApplicationRepository: typeof ContestApplication,
    private contestService: ContestService,
    private bookService: BooksService,
  ) {}

  async createApplication(dto: CreateContestApplicationDto) {
    const suspect = await this.contestApplicationRepository.findOne({
      where: { contestId: dto.contestId, bookId: dto.bookId },
    });
    this.checkExisting(suspect);

    await this.checkContestRequire(dto);

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

  async getApplicationsByContestId(
    id: number,
    {
      limit = ContestApplicationService.DEFAULT_LIMIT,
      offset = ContestApplicationService.DEFAULT_OFFSET,
    }: PaginationQueryParams,
  ) {
    return await this.contestApplicationRepository.findAndCountAll({
      where: { contestId: id },
      distinct: true,
      limit,
      offset,
    });
  }

  async getRealApplicationsByContestId(
    id: number,
    {
      limit = ContestApplicationService.DEFAULT_LIMIT,
      offset = ContestApplicationService.DEFAULT_OFFSET,
    }: PaginationQueryParams,
  ) {
    return await this.contestApplicationRepository.findAndCountAll({
      where: { contestId: id, status: true },
      distinct: true,
      limit,
      offset,
    });
  }

  async getUnrealApplicationsByContestId(
    id: number,
    {
      limit = ContestApplicationService.DEFAULT_LIMIT,
      offset = ContestApplicationService.DEFAULT_OFFSET,
    }: PaginationQueryParams,
  ) {
    return await this.contestApplicationRepository.findAndCountAll({
      where: { contestId: id, status: false },
      distinct: true,
      limit,
      offset,
    });
  }

  async getAllApplications({
    limit = ContestApplicationService.DEFAULT_LIMIT,
    offset = ContestApplicationService.DEFAULT_OFFSET,
  }: PaginationQueryParams) {
    return await this.contestApplicationRepository.findAndCountAll({
      distinct: true,
      limit,
      offset,
    });
  }

  async checkContestRequire(dto: CreateContestApplicationDto) {
    const contest = await this.contestService.getContestById(dto.contestId);
    const bookSymbols = await this.bookService.getBookSymbols(dto.bookId);

    if (contest.countCharacters && bookSymbols < contest.countCharacters) {
      throw new NotAcceptableException("Book doesn't have enough characters");
    }
  }

  checkNotFound(suspect: ContestApplication) {
    if (!suspect) throw new NotFoundException('Such application was not found');
  }

  checkExisting(suspect: ContestApplication) {
    if (suspect) throw new ConflictException('Such application already exists');
  }
}
