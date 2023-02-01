import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FileService } from 'src/file/file.service';
import { Genre } from 'src/genre/genre.model';
import { GenreService } from 'src/genre/genre.service';
import { UsersService } from 'src/users/users.service';
import { Book } from './books.model';
import { CreateBookDto } from './dto/create-book.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectModel(Book)
    private bookRepository: typeof Book,
    private genreService: GenreService,
    private fileService: FileService,
    private userService: UsersService,
  ) {}

  async createBook({ genres, ...dto }: CreateBookDto, img: any) {
    await this.validateUser(dto.userId);
    
    const fileName = await this.fileService.createFile(img);

    const genresArray = genres.split(',');
    const genreObjects: Genre[] = await Promise.all(
      genresArray.map((name) => this.genreService.getGenreByName(name)),
    );
    const book = await this.bookRepository.create({ ...dto, img: fileName });
    await book.$set('genres', genreObjects);
    return book;
  }

  async getAllBooks() {
    const books = await this.bookRepository.findAll({ include: { all: true } });
    return books;
  }

  private async validateUser(id: number) {
    const user = await this.userService.getUserById(id);
    if (!user) {
      throw new HttpException({ message: 'User not found' }, HttpStatus.NOT_FOUND);
    }
  }
}
