import { Injectable, NotFoundException } from '@nestjs/common';
import { Blog, BlogModelType } from '../domain/blog.entity';
import { InjectModel } from '@nestjs/mongoose';
import { BlogsRepository } from '../infrastructure/blog.repository';
import {
  CreateBlogDomainDto,
  UpdateBlogDomainDto,
} from '../domain/dto/blog.domain-dto';

@Injectable()
export class BlogsService {
  constructor(
    @InjectModel(Blog.name)
    private BlogModel: BlogModelType,
    private blogsRepository: BlogsRepository,
  ) {}

  async create(dto: CreateBlogDomainDto): Promise<string> {
    const blog = this.BlogModel.createInstance(dto);
    await this.blogsRepository.save(blog);
    return blog._id.toString();
  }

  async update(id: string, dto: UpdateBlogDomainDto) {
    const blog = await this.blogsRepository.findById(id);
    if (!blog) {
      throw new NotFoundException('Blog not found.');
    }
    blog.update(dto);
    await this.blogsRepository.save(blog);
  }

  async delete(id: string) {
    const blog = await this.blogsRepository.findById(id);
    if (!blog) {
      throw new NotFoundException('Blog not found.');
    }
    blog.flagAsDeleted();
    await this.blogsRepository.save(blog);
  }
}
