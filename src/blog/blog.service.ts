import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Blog } from './blog.model';
import { CreateBlogDto } from './dto/create-blog.dto';
import { PatchBlogDto } from './dto/patch-blog.dto';

@Injectable()
export class BlogService {
  constructor(@InjectModel(Blog) private blogRepository: typeof Blog) {}

  async createBlog(dto: CreateBlogDto) {
    const suspect = await this.blogRepository.findOne({
      where: { title: dto.title },
    });
    await this.checkExistingBlog(suspect);
    const parsedDto = await this.parseDto(dto);
    const blog = await this.blogRepository.create(parsedDto);
    return blog;
  }

  async getAllBlogs(limit?: number, offset?: number) {
    const blogs = await this.blogRepository.findAll({
      limit: limit ? +limit : undefined,
      offset: offset ? +offset : undefined,
    });
    return blogs;
  }

  async getBlogById(id: number) {
    const blog = await this.blogRepository.findByPk(id);
    await this.validateBlog(blog);
    return blog;
  }

  async getBlogsByUserId(id: number, limit?: number, offset?: number) {
    const blogs = await this.blogRepository.findAll({
      where: { userId: id },
      limit: limit ? +limit : undefined,
      offset: offset ? +offset : undefined,
    });
    return blogs;
  }

  async updateBlog(id: number, dto: PatchBlogDto) {
    const blog = await this.blogRepository.findByPk(id);
    await this.validateBlog(blog);

    await blog.update(dto);
    return blog;
  }

  async deleteBlog(id: number) {
    const blog = await this.blogRepository.findByPk(id);
    await this.validateBlog(blog);

    await blog.destroy();
    return blog;
  }

  private async parseDto(dto: CreateBlogDto) {
    const parsedDto = {
      ...dto,
      userId: +dto.userId,
    };
    return parsedDto;
  }

  private async validateBlog(blog: Blog) {
    if (!blog) {
      throw new HttpException('Blog not found', HttpStatus.NOT_FOUND);
    }
  }

  private async checkExistingBlog(blog: Blog) {
    if (blog) {
      throw new HttpException('Blog already exists', HttpStatus.BAD_REQUEST);
    }
  }
}
