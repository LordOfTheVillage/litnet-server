import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Book } from 'src/books/books.model';
import { PaginationQueryParams } from 'src/types/types';
import { CreateGenreDto } from './dto/create-genre.dto';
import { Genre } from './genre.model';

@Injectable()
export class GenreService {
  private static readonly DEFAULT_LIMIT = undefined;
  private static readonly DEFAULT_OFFSET = undefined;

  constructor(@InjectModel(Genre) private genreRepository: typeof Genre) {}

  async createGenre(dto: CreateGenreDto) {
    const genre = await this.genreRepository.create(dto);
    return genre;
  }

  async getGenreById(id: number) {
    const genre = await this.genreRepository.findByPk(id, {});
    console.log(genre);
    this.validateGenre(genre);
    return genre;
  }

  async getGenreByName(name: string) {
    console.log('name', name);
    const genre = await this.genreRepository.findOne({
      where: { name },
    });
    console.log('genre', genre);

    this.validateGenre(genre);
    return genre;
  }

  async getGenresByBookId(
    id: number,
    {
      limit = GenreService.DEFAULT_LIMIT,
      offset = GenreService.DEFAULT_OFFSET,
    }: PaginationQueryParams,
  ) {
    const { rows } = await this.genreRepository.findAndCountAll({
      distinct: true,
      include: { all: true },
      limit,
      offset,
    });
    const genres = rows.filter(({ books }) =>
      books.some((book) => book.id === id),
    );
    return genres;
  }

  async deleteGenre(id: number) {
    const genre = await this.genreRepository.findByPk(id);
    this.validateGenre(genre);
    await genre.destroy();
    return genre;
  }

  private validateGenre(genre: Genre) {
    if (!genre) {
      throw new HttpException('Genre not found', HttpStatus.NOT_FOUND);
    }
  }

  async getAllGenres({
    limit = GenreService.DEFAULT_LIMIT,
    offset = GenreService.DEFAULT_OFFSET,
  }: PaginationQueryParams) {
    const genres = await this.genreRepository.findAndCountAll({
      distinct: true,
      limit,
      offset,
    });
    return genres;
  }
}
