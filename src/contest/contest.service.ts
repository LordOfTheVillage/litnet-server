import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BooksService } from 'src/books/books.service';
import { FileService } from 'src/file/file.service';
import { Genre } from 'src/genre/genre.model';
import { GenreService } from 'src/genre/genre.service';
import { CreateContestDto } from './dto/create-contest.dto';
import { PatchContestDto } from './dto/patch-contest.dto';
import { Contest } from './models/contest.model';

@Injectable()
export class ContestService {
  constructor(
    @InjectModel(Contest) private contestRepository: typeof Contest,
    private fileService: FileService,
    private genreService: GenreService,
    private bookService: BooksService,
  ) {}

  async createContest({ genres, ...dto }: CreateContestDto, img?: any) {
    const suspect = await this.contestRepository.findOne({
      where: { title: dto.title },
    });
    await this.checkExistingContest(suspect);
    const parsedDto = await this.parseDto(dto);
    const fileName = await this.fileService.createFile(img);
    const genreObjects = await this.getGenreObjects(genres);
    const contest = await this.contestRepository.create({
      ...parsedDto,
      img: fileName,
    });
    await contest.$set('genres', genreObjects);
    return contest;
  }

  async getAllContests() {
    const contests = await this.contestRepository.findAll({
      include: { all: true },
    });
    return contests;
  }

  async getContestById(id: number) {
    const contest = await this.contestRepository.findOne({
      where: { id },
      include: { all: true },
    });
    this.validateContest(contest);
    return contest;
  }

  async updateContest({ genres, ...dto }: PatchContestDto, id: number, img?) {
    const contest = await this.contestRepository.findOne({ where: { id } });
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

  async addBook(id: number, bookId: number) {
    const { contest, contestBooks, book } = await this.getBooks(id, bookId);
    const newBooks = [...contestBooks, book];
    await contest.$add('books', newBooks);
    return contest;
  }

  async removeBook(id: number, bookId: number) {
    const { contest, contestBooks, book } = await this.getBooks(id, bookId);
    const newBooks = contestBooks.filter((b) => b.id !== book.id);
    await contest.$set('books', newBooks);
    return contest;
  }

  private async getBooks(id: number, bookId: number) {
    const contest = await this.contestRepository.findOne({ where: { id } });
    this.validateContest(contest);
    const contestBooks = await contest.$get('books');
    const book = await this.bookService.getBookById(bookId);
    return { contest, contestBooks, book };
  }

  async deleteContest(id: number) {
    const contest = await this.contestRepository.findOne({ where: { id } });
    this.validateContest(contest);
    await contest.destroy();
    return contest;
  }

  private async checkExistingContest(contest: Contest) {
    if (contest) {
      throw new HttpException('Contest already exists', HttpStatus.BAD_REQUEST);
    }
  }

  private async validateContest(contest: Contest) {
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
