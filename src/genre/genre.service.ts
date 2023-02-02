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
    if (!genre) {
      throw new HttpException('Genre not found', HttpStatus.NOT_FOUND);
    }
    return genre;
  }

  async getGenreByName(name: string) {
    const genre = await this.genreRepository.findOne({ where: { name } });
    if (!genre) {
      throw new HttpException('Genre not found', HttpStatus.NOT_FOUND);
    }
    return genre;
  }

  async getAllGenres() {
    const genres = await this.genreRepository.findAll();
    return genres;
  }
}