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
import {
  GenreQueryParams,
  BookQueryParams,
  PaginationQueryParams,
} from 'src/types/types';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { PatchBookDto } from './dto/patch-book.dto';
import { CreateCommentDto } from 'src/comment/dto/create-comment.dto';
import { PatchCommentDto } from 'src/comment/dto/patch-comment.dto';

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

  @Get('/:id/ratings')
  getBookRatings(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: PaginationQueryParams,
  ) {
    return this.booksService.getBookRatings(id, query);
  }

  @Get('/books/:id/chapters')
  getBookChapter(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: PaginationQueryParams,
  ) {
    return this.booksService.getBookChapter(id, query);
  }

  @Get('/books/:id/winner')
  getBookWins(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: PaginationQueryParams,
  ) {
    return this.booksService.getBookWins(id, query);
  }

  @Roles('USER', 'ADMIN')
  @UseGuards(RoleGuard)
  @Post('/:id/comments')
  createComment(@Body() dto: CreateCommentDto) {
    return this.booksService.createComment(dto);
  }

  @Get('/:id/comments')
  getCommentByBookId(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: PaginationQueryParams,
  ) {
    return this.booksService.getCommentsByBookId(id, query);
  }

  @Get('/:bookId/comments/:id')
  getCommentById(@Param('id', ParseIntPipe) id: number) {
    return this.booksService.getCommentById(id);
  }

  @Roles('USER', 'ADMIN')
  @UseGuards(RoleGuard)
  @Delete('/:bookId/comments/:id')
  deleteComment(@Param('id', ParseIntPipe) id: number) {
    return this.booksService.deleteComment(id);
  }

  @Roles('USER', 'ADMIN')
  @UseGuards(RoleGuard)
  @Patch('/:bookId/comments/:id')
  updateComment(
    @Body() dto: PatchCommentDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.booksService.updateComment(id, dto);
  }

  @Get('/book/:id')
  getBookmarksByBookId(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: PaginationQueryParams
  ) {
    return this.booksService.getBookmarksByBookId(id, query);
  }

  @Get('/genre')
  getAllByGenre(@Query() query: GenreQueryParams) {
    return this.booksService.getBooksByGenreName(query);
  }

  @Get('/:id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.booksService.getBookById(id);
  }
  
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
