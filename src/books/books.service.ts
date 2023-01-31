import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Book } from './books.model';
import { CreateBookDto } from './dto/create-book.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectModel(Book)
    private bookRepository: typeof Book,
  ) {}

  async createBook(dto: CreateBookDto) {
    const book = await this.bookRepository.create(dto);
    return book;
  }

  async getAllBooks() {
    const books = await this.bookRepository.findAll();
    return books;
  }
}
