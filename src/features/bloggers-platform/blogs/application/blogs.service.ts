import { Injectable } from '@nestjs/common';
import { CreateBlogDto, UpdateBlogDto } from '../dto/blog.main-dto';
import { BlogsRepository } from '../infrastructure/blog.repository';
import { Blog } from '../domain/blog.entity';

@Injectable()
export class BlogsService {
  constructor(private blogsRepository: BlogsRepository) {}

  async create(dto: CreateBlogDto): Promise<string> {
    const blog = Blog.createNewInstance(dto);
    return this.blogsRepository.save(blog);
  }

  async update(id: string, dto: UpdateBlogDto) {
    const blog = await this.blogsRepository.findByIdOrNotFoundException(id);
    blog.update(dto);
    await this.blogsRepository.save(blog);
  }

  async delete(id: string) {
    const blog = await this.blogsRepository.findByIdOrNotFoundException(id);
    blog.flagAsDeleted();
    await this.blogsRepository.save(blog);
  }

  async findById(id: string): Promise<string> {
    const res = await this.blogsRepository.findByIdOrNotFoundException(id);
    return res.id.toString();
  }
}
