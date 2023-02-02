import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateGenreDto } from './dto/create-genre.dto';
import { Genre } from './genre.model';

@Injectable()
export class GenreService {
  constructor(@InjectModel(Genre) private genreRepository: typeof Genre) {}

  async createGenre(dto: CreateGenreDto) {
    const genre = await this.genreRepository.create(dto);
    return genre;
  }

  async getGenreById(id: number) {
    const genre = await this.genreRepository.findByPk(id);
    await this.validateGenre(genre);
    return genre;
  }

  async getGenreByName(name: string) {
    const genre = await this.genreRepository.findOne({ where: { name } });
    await this.validateGenre(genre);
    return genre;
  }

  async getGenresByBookId(id: number) {
    const allGenres = await this.genreRepository.findAll({
      include: { all: true },
    });
    const genres = allGenres.filter(({ books }) =>
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

  private async validateGenre(genre: Genre) {
    if (!genre) {
      throw new HttpException('Genre not found', HttpStatus.NOT_FOUND);
    }
  }

  async getAllGenres() {
    const genres = await this.genreRepository.findAll({
      include: { all: true },
    });
    return genres;
  }
}
