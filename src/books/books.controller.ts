import {
  Controller,
  Post,
  Body,
  Get,
  UploadedFile,
  UseInterceptors,
  Patch,
  Param,
  ParseIntPipe,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { RoleGuard } from 'src/guards/role.guard';
import { Roles } from 'src/auth/roles.decorator';
import { GenreQueryParams, BookQueryParams } from 'src/types/types';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { PatchBookDto } from './dto/patch-book.dto';

@Controller('books')
export class BooksController {
  constructor(private booksService: BooksService) {}

  @Roles('USER', 'ADMIN')
  @UseGuards(RoleGuard)
  @Post()
  @UseInterceptors(FileInterceptor('img'))
  create(
    @Body() dto: CreateBookDto,
    @UploadedFile() img?: Express.Multer.File,
  ) {
    return this.booksService.createBook(dto, img);
  }

  @Get()
  getAll(@Query() query: BookQueryParams) {
    return this.booksService.getAllBooks(query);
  }

  @Get('/library/:userId')
  getLibraryBooks(
    @Param('userId', ParseIntPipe) userId: number,
    @Query() query: BookQueryParams,
  ) {
    return this.booksService.getLibraryBooks(userId, query);
  }

  @Get('/user/:id')
  getAllByUser(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: BookQueryParams,
  ) {
    return this.booksService.getBooksByUserId(id, query);
  }

  @Get('/genre')
  getAllByGenre(@Query() query: GenreQueryParams) {
    return this.booksService.getBooksByGenreName(query);
  }

  @Get('/:id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.booksService.getBookById(id);
  }

  // TODO get non-verified books
  @Roles('ADMIN')
  @UseGuards(RoleGuard)
  @Get('/verify/list')
  getVerifiedBooks(@Query() query: BookQueryParams) {
    return this.booksService.getVerifiedBooks(query);
  }

  // TODO verify book
  @Roles('ADMIN')
  @UseGuards(RoleGuard)
  @Post('/verify/:id')
  verifyBook(@Param('id', ParseIntPipe) id: number) {
    return this.booksService.verifyBook(id);
  }

  @Roles('USER', 'ADMIN')
  @UseGuards(RoleGuard)
  @Patch('/:id')
  @UseInterceptors(FileInterceptor('img'))
  update(
    @Body() dto: PatchBookDto,
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() img?: Express.Multer.File,
  ) {
    return this.booksService.updateBook(dto, id, img);
  }

  @Roles('USER', 'ADMIN')
  @UseGuards(RoleGuard)
  @Delete('/:id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.booksService.deleteBook(id);
  }
}
