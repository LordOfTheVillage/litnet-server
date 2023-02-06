import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Bookmark } from 'src/bookmark/bookmark.model';
import { Chapter } from 'src/chapter/chapter.model';
import { ChapterService } from 'src/chapter/chapter.service';
import { Comment } from 'src/comment/comment.model';
import { CommentService } from 'src/comment/comment.service';
import { FileService } from 'src/file/file.service';
import { Genre } from 'src/genre/genre.model';
import { GenreService } from 'src/genre/genre.service';
import { Rating } from 'src/rating/rating.model';
import { RatingService } from 'src/rating/rating.service';
import { User } from 'src/users/user.model';
import { UsersService } from 'src/users/users.service';
import { Book } from './books.model';
import { CreateBookDto } from './dto/create-book.dto';
import { PatchBookDto } from './dto/patch-book.dto';

@Injectable()
export class BooksService {
  private static includeObject = [
    { model: Genre, attributes: ['id'], through: { attributes: [] } },
    { model: Chapter, attributes: ['id'] },
    { model: Comment, attributes: ['id'] },
    { model: Rating, attributes: ['rating'] },
    { model: User, attributes: ['name'] },
    { model: Bookmark, attributes: ['id']}
  ];

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

  async createBook({ genres, ...dto }: CreateBookDto, img?: any) {
    await this.validateUser(dto.userId);

    const fileName = img ? await this.fileService.createFile(img) : null;

    const genresArray = genres.split(' ');
    const genreObjects: Genre[] = await Promise.all(
      genresArray.map((name) => this.genreService.getGenreByName(name)),
    );
    const book = await this.bookRepository.create({ ...dto, img: fileName });
    await book.$set('genres', genreObjects);
    return book;
  }

  async getAllBooks(limit?: number, offset?: number) {
    const books = await this.bookRepository.findAndCountAll({
      limit: limit ? limit : undefined,
      offset: offset ? offset : undefined,
      include: BooksService.includeObject,
    });
    return books;
  }

  async getBooksByUserId(id: number, limit?: number, offset?: number) {
    const books = await this.bookRepository.findAndCountAll({
      where: { userId: id },
      limit: limit ? limit : undefined,
      offset: offset ? offset : undefined,
      include: BooksService.includeObject,
    });
    return books;
  }

  async getBookById(id: number) {
    const book = await this.bookRepository.findOne({
      where: { id },
      include: { all: true },
    });
    this.validateBook(book);
    return book;
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
