import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Book } from 'src/books/books.model';
import { BooksService } from 'src/books/books.service';
import { FileService } from 'src/file/file.service';
import { Genre } from 'src/genre/genre.model';
import { GenreService } from 'src/genre/genre.service';
import { PaginationQueryParams, VerifiedParams } from 'src/types/types';
import { User } from 'src/users/user.model';
import { CreateContestDto } from './dto/create-contest.dto';
import { PatchContestDto } from './dto/patch-contest.dto';
import { Contest } from './models/contest.model';
import { Cron } from '@nestjs/schedule';
import { ContestApplication } from 'src/contest-application/contest-application.model';
import { ContestWinner } from 'src/contest-winner/contest-winner.model';
import { ContestModeration } from 'src/contest-moderation/contest-moderation.model';
import { ContestCommentService } from 'src/contest-comment/contest-comment.service';
import { PatchContestCommentDto } from 'src/contest-comment/dto/patch-contest-comment.dto';
import { CreateContestCommentDto } from 'src/contest-comment/dto/create-contest-comment.dto';
import { ContestApplicationService } from 'src/contest-application/contest-application.service';
import { ContestModerationService } from 'src/contest-moderation/contest-moderation.service';
import { ContestWinnerService } from 'src/contest-winner/contest-winner.service';
import { CreateContestApplicationDto } from 'src/contest-application/dto/create-contest-application.dto';
import { PatchContestApplicationDto } from 'src/contest-application/dto/update-contest-application.dto';
import { CreateContestWinnerDto } from 'src/contest-winner/dto/create-contest-winner.dto';
import { CreateContestModerationDto } from 'src/contest-moderation/dto/create-moderation.dto';

@Injectable()
export class ContestService {
  private static readonly DEFAULT_LIMIT = 10;
  private static readonly DEFAULT_OFFSET = 0;
  constructor(
    @InjectModel(Contest) private contestRepository: typeof Contest,
    private fileService: FileService,
    private genreService: GenreService,
    private contestCommentService: ContestCommentService,
    private contestApplicationService: ContestApplicationService,
    private contestModerationService: ContestModerationService,
    private contestWinnerService: ContestWinnerService,
  ) {}

  async createContest({ genres, ...dto }: CreateContestDto, img?: any) {
    const suspectByTitle = await this.contestRepository.findOne({
      where: { title: dto.title },
    });
    this.checkExistingContest(suspectByTitle);

    const suspectByUser = await this.contestRepository.findOne({
      where: { userId: +dto.userId },
    });
    this.checkExistingContest(suspectByUser);

    const parsedDto = await this.parseDto(dto);
    const fileName = img ? await this.fileService.createFile(img) : null;
    const genreObjects = await this.getGenreObjects(genres);
    const contest = await this.contestRepository.create({
      ...parsedDto,
      img: fileName,
    });
    await contest.$set('genres', genreObjects);
    return contest;
  }

  async getAllContests({
    limit = ContestService.DEFAULT_LIMIT,
    offset = ContestService.DEFAULT_OFFSET,
    disabled = false,
  }: VerifiedParams) {
    console.log("limit", limit)
    console.log("offset", offset)
    console.log("disabled", disabled)
    const contests = await this.contestRepository.findAndCountAll({
      distinct: true,
      where: {
        status: disabled,
      },
      limit,
      offset,
      include: { model: ContestApplication, attributes: ['id'] },
    });
    return contests;
  }

  async getContestsByUserId(
    id: number,
    {
      limit = ContestService.DEFAULT_LIMIT,
      offset = ContestService.DEFAULT_OFFSET,
    }: PaginationQueryParams,
  ) {
    const contests = await this.contestRepository.findAndCountAll({
      where: { userId: id },
      distinct: true,
      limit,
      offset,
    });
    return contests;
  }

  async getContestById(id: number) {
    const contest = await this.contestRepository.findOne({
      where: { id },
      include: [
        { model: User, attributes: ['id', 'name'] },
        { model: ContestApplication },
        { model: ContestWinner },
        { model: ContestModeration },
        { model: Genre, attributes: ['name'] },
      ],
    });
    this.validateContest(contest);
    return contest;
  }

  async createComment(dto: CreateContestCommentDto) {
    return await this.contestCommentService.createComment(dto);
  }

  async getCommentsByContestId(id: number, query: PaginationQueryParams) {
    return await this.contestCommentService.getCommentsByContestId(id, query);
  }

  async getAllComments(query: PaginationQueryParams) {
    return await this.contestCommentService.getAllComments(query);
  }

  async getCommentById(id: number) {
    return await this.contestCommentService.getCommentById(id);
  }

  async updateComment(id: number, dto: PatchContestCommentDto) {
    return await this.contestCommentService.updateComment(id, dto);
  }

  async deleteComment(id: number) {
    return await this.contestCommentService.deleteComment(id);
  }

  async createApplication(dto: CreateContestApplicationDto) {
    return await this.contestApplicationService.createApplication(dto);
  }

  async updateApplication(id: number, dto: PatchContestApplicationDto) {
    return await this.contestApplicationService.updateApplication(id, dto);
  }

  async deleteApplication(id: number) {
    return await this.contestApplicationService.deleteApplication(id);
  }

  async getApplicationsByContestId(id: number, query: PaginationQueryParams) {
    return await this.contestApplicationService.getApplicationsByContestId(
      id,
      query,
    );
  }

  async createWinner(dto: CreateContestWinnerDto) {
    return await this.contestWinnerService.createWinner(dto);
  }

  async getAllApplications(query: PaginationQueryParams) {
    return await this.contestApplicationService.getAllApplications(query);
  }

  async getApplicationById(id: number) {
    return await this.contestApplicationService.getApplicationById(id);
  }

  async createModeration(dto: CreateContestModerationDto) {
    return await this.contestModerationService.createModeration(dto);
  }

  async deleteModeration(id: number) {
    return await this.contestModerationService.deleteModeration(id);
  }

  async getModeratorsByContestId(id: number, query: PaginationQueryParams) {
    return await this.contestModerationService.getByContestId(id, query);
  }

  async getAllModerators(query: PaginationQueryParams) {
    return await this.contestModerationService.getAllModerators(query);
  }

  async updateContest({ genres, ...dto }: PatchContestDto, id: number, img?) {
    const contest = await this.contestRepository.findByPk(id);
    this.validateContest(contest);
    const parsedDto = await this.parseDto(dto);

    const fileName = img ? await this.fileService.createFile(img) : contest.img;

    let genreObjects: Genre[] = [];
    if (genres) genreObjects = await this.getGenreObjects(genres);

    if (genreObjects.length) {
      await contest.$remove('genres', contest.genres);
      await contest.$set('genres', genreObjects);
    }
    await contest.update({ ...parsedDto, img: fileName });
    return contest;
  }

  async updateStatus(id: number, value: boolean) {
    const contest = await this.contestRepository.findByPk(id);
    this.validateContest(contest);

    return await contest.update({ ...contest, status: value });
  }

  @Cron('0 0 * * *')
  async updateContestStatus() {
    const currentDate = new Date();
    const contests = await this.getAllContests({});

    for (const contest of contests.rows) {
      if (currentDate >= new Date(contest.date)) {
        await this.updateStatus(contest.id, true);
      }
    }
  }

  async deleteContest(id: number) {
    const contest = await this.contestRepository.findByPk(id);
    this.validateContest(contest);
    await contest.destroy();
    return contest;
  }

  private checkExistingContest(contest: Contest) {
    if (contest) {
      throw new HttpException('Contest already exists', HttpStatus.BAD_REQUEST);
    }
  }

  private validateContest(contest: Contest) {
    if (!contest) {
      throw new HttpException('Contest does not exist', HttpStatus.NOT_FOUND);
    }
  }

  private async parseDto(
    dto: Omit<CreateContestDto | PatchContestDto, 'genres'>,
  ) {
    const { date, userId, countCharacters, prize } = dto;
    if (date && !/\d{4}(-)\d{2}(-)\d{2}/g.test(date)) {
      throw new HttpException('Date is not valid', HttpStatus.BAD_REQUEST);
    }
    const parsedDto = {
      ...dto,
      prize: prize ? Number(prize) : undefined,
      countCharacters: countCharacters ? Number(countCharacters) : undefined,
      userId: userId ? Number(userId) : undefined,
    };
    return parsedDto;
  }

  private async getGenreObjects(genres: string) {
    const genresList = genres.split(' ');
    const genreObjects = await Promise.all(
      genresList.map(
        async (genre) => await this.genreService.getGenreByName(genre),
      ),
    );
    return genreObjects;
  }
}
