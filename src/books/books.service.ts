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
    { model: Genre, attributes: ['id', 'name'], through: { attributes: [] } },
    { model: Chapter, attributes: ['id'] },
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

  async getAllBooks(
    limit?: number,
    offset?: number,
    sort?: string,
    order?: string,
  ) {
    const books = await this.bookRepository.findAndCountAll({
      limit: limit || undefined,
      offset: offset || undefined,
      include: BooksService.includeObject,
    });

    return this.switchSorting(books, sort, order);
  }

  async getBooksByGenreName(
    name: string,
    limit?: number,
    offset?: number,
    sort?: string,
    order?: string,
  ) {
    const books = await this.bookRepository.findAndCountAll({
      include: [
        ...BooksService.includeObject,
        { model: Genre, where: { name } },
      ],
      limit: limit || undefined,
      offset: offset || undefined,
    });

    return this.switchSorting(books, sort, order);
  }

  async getBooksByUserId(id: number, limit?: number, offset?: number, sort?: string, order?: string) {
    const books = await this.bookRepository.findAndCountAll({
      where: { userId: id },
      limit: limit || undefined,
      offset: offset || undefined,
      include: BooksService.includeObject,
    });

    return this.switchSorting(books, sort, order);
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
