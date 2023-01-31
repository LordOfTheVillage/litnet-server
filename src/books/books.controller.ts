import { Controller, Post, Body, Get } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';

@Controller('books')
export class BooksController {
  constructor(private booksService: BooksService) {}

  @Post()
  create(@Body() dto: CreateBookDto) {
    return this.booksService.createBook(dto);
  }

  @Get()
  getAll() {
    return this.booksService.getAllBooks();
  }
}
