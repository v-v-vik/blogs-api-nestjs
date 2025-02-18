import { Injectable } from '@nestjs/common';
import { CreatePostDto, UpdatePostDto } from '../dto/post.main-dto';
import { SQLBlogsRepository } from '../../blogs/infrastructure/blog-sql.repository';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { SQLPostsRepository } from '../infrastructure/post-sql.repository';
import { Post } from '../domain/post-sql.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    private sqlPostsRepository: SQLPostsRepository,
    private sqlBlogsRepository: SQLBlogsRepository,
  ) {}

  async create(dto: CreatePostDto): Promise<string> {
    await this.sqlBlogsRepository.findByIdOrNotFoundException(dto.blogId);
    const post = Post.createNewInstance(dto);
    return await this.sqlPostsRepository.create(post);
  }

  async update(id: string, dto: UpdatePostDto): Promise<void> {
    await this.sqlBlogsRepository.findByIdOrNotFoundException(dto.blogId);
    const post = await this.sqlPostsRepository.findByIdOrNotFoundException(id);
    post.update(dto);
    await this.sqlPostsRepository.update(post);
  }

  async delete(id: string): Promise<void> {
    const post = await this.sqlPostsRepository.findByIdOrNotFoundException(id);
    post.flagAsDeleted();
    await this.sqlPostsRepository.update(post);
  }

  //async findAllWithBlogId(id: string): Promise<Post[]> {}
}
