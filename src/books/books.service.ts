import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ChapterService } from 'src/chapter/chapter.service';
import { CommentService } from 'src/comment/comment.service';
import { FileService } from 'src/file/file.service';
import { Genre } from 'src/genre/genre.model';
import { GenreService } from 'src/genre/genre.service';
import { RatingService } from 'src/rating/rating.service';
import { UsersService } from 'src/users/users.service';
import { Book } from './books.model';
import { CreateBookDto } from './dto/create-book.dto';
import { PatchBookDto } from './dto/patch-book.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectModel(Book)
    private bookRepository: typeof Book,
    private genreService: GenreService,
    private fileService: FileService,
    private userService: UsersService,
    private chapterService: ChapterService,
    private ratingService: RatingService,
    private commentService: CommentService,
  ) {}

  async createBook({ genres, ...dto }: CreateBookDto, img: any) {
    await this.validateUser(dto.userId);

    const fileName = await this.fileService.createFile(img);

    const genresArray = genres.split(' ');
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

  async updateBook({ genres, ...dto }: PatchBookDto, id: number, img?) {
    const book = await this.bookRepository.findOne({ where: { id } });
    this.validateBook(book);

    const fileName = img ? await this.fileService.createFile(img) : book.img;
    const genresArray = genres.split(' ');
    const genreObjects: Genre[] = await Promise.all(
      genresArray.map((name) => this.genreService.getGenreByName(name)),
    );

    await book.$remove('genres', book.genres);
    await book.$set('genres', genreObjects);
    await book.update({ ...dto, img: fileName });
    return book;
  }

  async deleteBook(id: number) {
    const book = await this.bookRepository.findOne({
      where: { id },
      include: { all: true },
    });
    this.validateBook(book);

    const comments = book.comments || [];
    await comments.forEach(
      async (comment) => await this.commentService.deleteComment(comment.id),
    );

    // РАБОТАЕТ, НО ТОГДА СТРАТЕГИЯ ПО СОЗДАНИЮ КНИГ ПО СУЩЕСТВУЮЩИМ ЖАНРАМ НЕ РАБОТАЕТ

    // const genres = await this.genreService.getGenresByBookId(id);
    // await genres.forEach(async (genre) => {
    //   const books = genre.books || [];
    //   if (books.length === 1 && books[0].id === id) {
    //     await this.genreService.deleteGenre(genre.id);
    //   }
    // });

    const chapters = book.chapters || [];
    await chapters.forEach(
      async (chapter) => await this.chapterService.deleteChapter(chapter.id),
    );

    const ratings = book.ratings || [];
    await ratings.forEach(
      async (rating) => await this.ratingService.deleteRating(rating.id),
    );

    await this.fileService.deleteFile(book.img);

    await book.destroy();
    return book;
  }

  private async validateBook(book: Book) {
    if (!book) {
      throw new HttpException(
        { message: 'Such book does not exist' },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  private async validateUser(id: number) {
    const user = await this.userService.getUserById(id);
    if (!user) {
      throw new HttpException(
        { message: 'User not found' },
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
