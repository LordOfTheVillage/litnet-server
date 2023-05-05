import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
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
import {
  GenreQueryParams,
  BookQueryParams,
  PaginationQueryParams,
} from 'src/types/types';
import { User } from 'src/users/user.model';
import { Book } from './books.model';
import { CreateBookDto } from './dto/create-book.dto';
import { PatchBookDto } from './dto/patch-book.dto';
import { ContestWinnerService } from 'src/contest-winner/contest-winner.service';
import { CreateCommentDto } from 'src/comment/dto/create-comment.dto';
import { PatchCommentDto } from 'src/comment/dto/patch-comment.dto';
import { BookmarkService } from 'src/bookmark/bookmark.service';

@Injectable()
export class BooksService {
  private static readonly DEFAULT_LIMIT = undefined;
  private static readonly DEFAULT_OFFSET = undefined;
  private static includeObject = [
    { model: Genre, attributes: ['id', 'name'], through: { attributes: [] } },
    { model: Chapter, attributes: ['id', 'title', 'number'] },
    { model: Comment, attributes: ['id'] },
    { model: Rating, attributes: ['rating'] },
    { model: User, attributes: ['name'] },
    { model: Bookmark, attributes: ['id'] },
  ];

  constructor(
    @InjectModel(Book)
    private bookRepository: typeof Book,
    private genreService: GenreService,
    private fileService: FileService,
    private chapterService: ChapterService,
    private ratingService: RatingService,
    private contestWinnerService: ContestWinnerService,
    private commentService: CommentService,
    private bookmarkService: BookmarkService,
  ) {}

  async createBook({ genres, ...dto }: CreateBookDto, img?: any) {
    const fileName = img ? await this.fileService.createFile(img) : null;

    const genresArray = genres.split(' ');
    const genreObjects: Genre[] = await Promise.all(
      genresArray.map((name) => this.genreService.getGenreByName(name)),
    );
    const book = await this.bookRepository.create({ ...dto, img: fileName });
    await book.$set('genres', genreObjects);
    return book;
  }

  async getAllBooks({
    limit = BooksService.DEFAULT_LIMIT,
    offset = BooksService.DEFAULT_OFFSET,
    sort,
    order,
    disabled: verified = true,
    genre = '',
    search: title = '',
  }: GenreQueryParams) {
    const books = await this.bookRepository.findAndCountAll({
      distinct: true,
      where: {
        verified,
        title: {
          [Op.iLike]: `%${title}%`,
        },
      },
      limit,
      offset,
      include: [
        ...BooksService.includeObject,
        { model: Genre, where: { name: { [Op.iLike]: `%${genre}%` } } },
      ],
    });
    return this.switchSorting(books, sort, order);
  }

  async getBookmarksByBookId(id: number, query: PaginationQueryParams) {
    return await this.bookmarkService.getByBookId(id, query);
  }

  async getBooksByGenreName({
    genre,
    limit = BooksService.DEFAULT_LIMIT,
    offset = BooksService.DEFAULT_OFFSET,
    sort,
    order,
    disabled: verified = true,
  }: GenreQueryParams) {
    const books = await this.bookRepository.findAndCountAll({
      include: [
        ...BooksService.includeObject,
        { model: Genre, where: { name: genre } },
      ],
      where: {
        verified,
      },
      distinct: true,
      limit,
      offset,
    });

    return this.switchSorting(books, sort, order);
  }

  async getBookRatings(id: number, params: PaginationQueryParams = {}) {
    return await this.ratingService.getRatingsByBookId(id, params);
  }

  async getBookChapter(id: number, params: PaginationQueryParams = {}) {
    return await this.chapterService.getChaptersByBookId(id, params);
  }

  async getBookWins(id: number, params: PaginationQueryParams = {}) {
    return await this.contestWinnerService.getByBookId(id);
  }

  async createComment(dto: CreateCommentDto) {
    return await this.commentService.createComment(dto);
  }

  async getCommentsByBookId(id: number, params: PaginationQueryParams) {
    return await this.commentService.getCommentsByBookId(id, params);
  }

  async getCommentById(id: number) {
    return await this.commentService.getCommentById(id);
  }

  async deleteComment(id: number) {
    return await this.commentService.deleteComment(id);
  }

  async updateComment(id: number, dto: PatchCommentDto) {
    return await this.commentService.updateComment(dto, id);
  }

  async getLibraryBooks(
    user: User,
    {
      limit = BooksService.DEFAULT_LIMIT,
      offset = BooksService.DEFAULT_OFFSET,
      sort,
      order,
      disabled: verified = true,
    }: BookQueryParams,
  ) {
    const bookIds = user.bookmarks.map((b) => b.bookId);
    const books = await this.bookRepository.findAndCountAll({
      where: { id: bookIds, verified },
      distinct: true,
      limit,
      offset,
      include: BooksService.includeObject,
    });

    return this.switchSorting(books, sort, order);
  }

  async getBooksByUserId(
    id: number,
    {
      limit = BooksService.DEFAULT_LIMIT,
      offset = BooksService.DEFAULT_OFFSET,
      sort,
      order,
    }: BookQueryParams,
  ) {
    const books = await this.bookRepository.findAndCountAll({
      where: { userId: id },
      distinct: true,
      limit,
      offset,
      include: BooksService.includeObject,
    });

    return this.switchSorting(books, sort, order);
  }

  async getBookById(id: number) {
    const book = await this.bookRepository.findOne({
      where: { id },
      include: BooksService.includeObject,
    });
    this.validateBook(book);
    return book;
  }

  async verifyBook(id: number) {
    const book = await this.bookRepository.findOne({
      where: { id },
    });
    this.validateBook(book);
    const result = await book.update({ ...book, verified: true });
    return result;
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

  async getBookSymbols(id: number) {
    const book = await this.getBookById(id);
    const chapters = book.chapters || [];
    const symbols = chapters.map(
      async (c) => await this.chapterService.getSymbols(c.id),
    );

    return await Promise.all(symbols).then((s) =>
      s.reduce((acc, e) => (acc += e), 0),
    );
  }

  async deleteBook(id: number) {
    const book = await this.bookRepository.findOne({
      where: { id },
      include: { all: true },
    });
    this.validateBook(book);

    await this.fileService.deleteFile(book.img);

    await book.destroy();
    return book;
  }

  private switchSorting(books, sort, order) {
    if (!sort && !order) return books;

    switch (sort) {
      case 'rating':
        return this.sortByRating(books, order);
      case 'date':
        return this.sortByDate(books, order);
      case 'bookmarks':
        return this.sortByBookmarks(books, order);
      default:
        return books;
    }
  }

  private sortByBookmarks(books, order: string) {
    const sortedBooks = [...books.rows].sort((a, b) => {
      return a.bookmarks.length - b.bookmarks.length;
    });
    return this.setOrderedBooks(sortedBooks, books.count, order);
  }

  private sortByDate(books, order: string) {
    const sortedBooks = [...books.rows].sort((a, b) => {
      return a.createdAt.getTime() - b.createdAt.getTime();
    });
    return this.setOrderedBooks(sortedBooks, books.count, order);
  }

  private sortByRating(books, order: string) {
    const sortedBooks = [...books.rows].sort((a, b) => {
      const aRating = a.ratings.reduce((acc, rating) => {
        return acc + rating.rating;
      }, 0);
      const bRating = b.ratings.reduce((acc, rating) => {
        return acc + rating.rating;
      }, 0);
      return aRating - bRating;
    });
    return this.setOrderedBooks(sortedBooks, books.count, order);
  }

  private setOrderedBooks(sortedBooks, count: number, order: string) {
    return order.toLowerCase().trim() === 'desc'
      ? { rows: sortedBooks.reverse(), count }
      : { rows: sortedBooks, count };
  }

  private validateBook(book: Book) {
    if (!book) {
      throw new HttpException(
        { message: 'Such book does not exist' },
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
