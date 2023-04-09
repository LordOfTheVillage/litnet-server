import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Book } from 'src/books/books.model';
import { BooksService } from 'src/books/books.service';
import { FileService } from 'src/file/file.service';
import { Genre } from 'src/genre/genre.model';
import { GenreService } from 'src/genre/genre.service';
import { PaginationQueryParams } from 'src/types/types';
import { User } from 'src/users/user.model';
import { CreateContestDto } from './dto/create-contest.dto';
import { PatchContestDto } from './dto/patch-contest.dto';
import { Contest } from './models/contest.model';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class ContestService {
  private static readonly DEFAULT_LIMIT = 10;
  private static readonly DEFAULT_OFFSET = 0;
  constructor(
    @InjectModel(Contest) private contestRepository: typeof Contest,
    private fileService: FileService,
    private genreService: GenreService,
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
  }: PaginationQueryParams) {
    const contests = await this.contestRepository.findAndCountAll({
      include: { model: Book, attributes: ['id'] },
      distinct: true,
      limit: limit || undefined,
      offset: offset || undefined,
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
      include: { model: Book, attributes: ['id'] },
      distinct: true,
      limit: limit || undefined,
      offset: offset || undefined,
    });
    return contests;
  }

  async getContestById(id: number) {
    const contest = await this.contestRepository.findOne({
      where: { id },
      include: [
        { model: Book, attributes: ['id'] },
        { model: User, attributes: ['id', 'name'] },
      ],
    });
    this.validateContest(contest);
    return contest;
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
