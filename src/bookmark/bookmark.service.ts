import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ReadingProgressService } from 'src/reading-progress/reading-progress.service';
import { Bookmark } from './bookmark.model';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { PatchBookmarkDto } from './dto/patch-bookmark.dto';

@Injectable()
export class BookmarkService {
  constructor(
    @InjectModel(Bookmark)
    private bookmarkRepository: typeof Bookmark,
    private readingProgressService: ReadingProgressService,
  ) {}

  async createBookmark({
    userId,
    bookId,
    chapterId,
    pageId,
  }: CreateBookmarkDto) {
    const testBookmark = await this.bookmarkRepository.findOne({
      where: { userId, bookId },
    });
    await this.validateBookmark(testBookmark, true);

    const readingProgress =
      await this.readingProgressService.createReadingProgress({
        chapterId,
        pageId,
      });
    const bookmark = await this.bookmarkRepository.create({
      userId,
      bookId,
      progressId: readingProgress.id,
    });
    return bookmark;
  }

  async getById(id: number) {
    const bookmark = await this.bookmarkRepository.findByPk(id);
    await this.validateBookmark(bookmark);
    return bookmark;
  }

  async deleteBookmark(id: number) {
    const bookmark = await this.bookmarkRepository.findByPk(id);
    await this.validateBookmark(bookmark);
    await this.readingProgressService.deleteReadingProgress(
      bookmark.progressId,
    );
    await bookmark.destroy();
    return bookmark;
  }

  async updateBookmark(id: number, dto: PatchBookmarkDto) {
    const bookmark = await this.bookmarkRepository.findByPk(id);
    await this.validateBookmark(bookmark);
    const readingProgress = await this.readingProgressService.getById(
      bookmark.progressId,
    );
    await this.readingProgressService.updateReadingProgress(
      dto,
      readingProgress.id,
    );
    return bookmark;
  }

  private async validateBookmark(bookmark: Bookmark, reverse: boolean = false) {
    if (reverse ? bookmark : !bookmark) {
      throw new HttpException(
        'Such bookmark does not exist',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
