import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Genre } from 'src/genre/genre.model';
import { GenreService } from 'src/genre/genre.service';
import { Book } from './books.model';
import { CreateBookDto } from './dto/create-book.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectModel(Book)
    private bookRepository: typeof Book,
    private genreService: GenreService,
  ) {}

  async createBook(dto: CreateBookDto) {
    // const book = await this.bookRepository.create(dto);
    const names = dto.genres;
    const genreObjects: Genre[] = await Promise.all(
      names.map((name) => this.genreService.getGenreByName(name)),
    )
    const book = await this.bookRepository.create({...dto, genres: genreObjects});
    return book;
  }

  async getAllBooks() {
    const books = await this.bookRepository.findAll();
    return books;
  }
}
