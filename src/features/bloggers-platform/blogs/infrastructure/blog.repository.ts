import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Blog } from '../domain/blog.entity';
import { NotFoundDomainException } from '../../../../core/exceptions/domain-exceptions';
import { DeletionStatus } from '../../../../core/dto/deletion-status.enum';

@Injectable()
export class BlogsRepository {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(Blog) private blogsRepo: Repository<Blog>,
  ) {}

  async findByIdOrNotFoundException(id: string): Promise<Blog> {
    const res = await this.blogsRepo.findOne({
      where: {
        id: Number(id),
        deletionStatus: DeletionStatus.NotDeleted,
      },
    });
    if (!res) {
      throw NotFoundDomainException.create('Blog not found.');
    }
    return res;
  }

  async save(blog: Blog): Promise<string> {
    const res = await this.blogsRepo.save(blog);
    return res.id.toString();
  }
}
