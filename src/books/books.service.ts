import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FileService } from 'src/file/file.service';
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
    private fileService: FileService,
  ) {}

  // async createBook(dto: CreateBookDto) {
  //   // const book = await this.bookRepository.create(dto);
  //   const names = dto.genres;
  //   const genreObjects: Genre[] = await Promise.all(
  //     names.map((name) => this.genreService.getGenreByName(name)),
  //   )
  //   const book = await this.bookRepository.create({...dto, genres: genreObjects});
  //   return book;
  // }
  async createBook({ genres, ...dto }: CreateBookDto) {
    // const fileName = await this.fileService.createFile(img);
    // const genresArray = genres.split(',');
    // const genreObjects: Genre[] = await Promise.all(
    //   genresArray.map((name) => this.genreService.getGenreByName(name)),
    // );
    // const book = await this.bookRepository.create({ ...dto, img: fileName });
    // book.genres = genreObjects;
    // return await book.save();
    console.log(dto)
    const genresArray = genres.split(',');
    const genreObjects: Genre[] = await Promise.all(
      genresArray.map((name) => this.genreService.getGenreByName(name)),
    );
    const book = await this.bookRepository.create({ ...dto});
    book.genres = genreObjects;
    return await book.save();
  }

  async getAllBooks() {
    const books = await this.bookRepository.findAll();
    return books;
  }
}
