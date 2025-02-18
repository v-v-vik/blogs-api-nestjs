import { Injectable } from '@nestjs/common';
import { CreateBlogDto, UpdateBlogDto } from '../dto/blog.main-dto';
import { SQLBlogsRepository } from '../infrastructure/blog-sql.repository';
import { Blog } from '../domain/blog-sql.entity';

@Injectable()
export class BlogsService {
  constructor(private sqlBlogsRepository: SQLBlogsRepository) {}

  async create(dto: CreateBlogDto): Promise<string> {
    const blog = Blog.createNewInstance(dto);
    return this.sqlBlogsRepository.create(blog);
  }

  async update(id: string, dto: UpdateBlogDto) {
    const blog = await this.sqlBlogsRepository.findByIdOrNotFoundException(id);
    blog.update(dto);
    await this.sqlBlogsRepository.update(blog);
  }

  async delete(id: string) {
    const blog = await this.sqlBlogsRepository.findByIdOrNotFoundException(id);
    blog.flagAsDeleted();
    await this.sqlBlogsRepository.update(blog);
  }

  async findById(id: string): Promise<string> {
    const res = await this.sqlBlogsRepository.findByIdOrNotFoundException(id);
    return res.id.toString();
  }
}
