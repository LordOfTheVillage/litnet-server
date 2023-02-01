import {
  Controller,
  Post,
  Body,
  Get,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';

@Controller('books')
export class BooksController {
  constructor(private booksService: BooksService) {}

  // @Post()
  // @UseInterceptors(FileInterceptor('img'))
  // create(
  //   @Body() dto: CreateBookDto,
  //   @UploadedFile() img: Express.Multer.File,
  // ) {
  //   return this.booksService.createBook(dto, img);
  // }

  @Post()
  create(@Body() dto: CreateBookDto) {
    return this.booksService.createBook(dto);
  }

  @Get()
  getAll() {
    return this.booksService.getAllBooks();
  }
}
