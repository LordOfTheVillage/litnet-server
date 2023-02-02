import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreatePageDto } from './dto/create-page.dto';
import { PatchPageDto } from './dto/patch-page.dto';
import { Page } from './page.model';

@Injectable()
export class PageService {
  constructor(@InjectModel(Page) private pageRepository: typeof Page) {}

  async createPage(dto: CreatePageDto) {
    const pages = await this.getPagesByChapterId(dto.chapterId);
    const number = pages.length + 1;
    const page = await this.pageRepository.create({ ...dto, number });
    return page;
  }

  async getPagesByChapterId(chapterId: number) {
    const pages = await this.pageRepository.findAll({
      where: { chapterId },
    });
    return pages;
  }

  async getAllPages() {
    const pages = await this.pageRepository.findAll();
    return pages;
  }

  async getPageById(id: number) {
    const page = await this.pageRepository.findOne({ where: { id } });
    return page;
  }

  async deletePage(id: number) {
    const page = await this.pageRepository.findOne({ where: { id } });
    this.validatePage(page);
    await this.updatePagesNumbers(page.chapterId, page.number);

    await page.destroy();
    return page;
  }

  async updatePage(id: number, dto: PatchPageDto) {
    const page = await this.pageRepository.findOne({ where: { id } });
    this.validatePage(page);
    await page.update(dto);
    return page;
  }

  private validatePage(page: Page) {
    if (!page) {
      throw new HttpException(
        { message: 'Such page does not exist' },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  private async updatePagesNumbers(chapterId: number, number: number) {
    const pages = await this.getPagesByChapterId(chapterId);
    const pagesToUpdate = pages.filter((p) => p.number > number);
    pagesToUpdate.forEach(async (p) => {
      await p.update({ number: p.number - 1 });
    });
  }
}
