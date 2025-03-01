import { Injectable } from '@nestjs/common';
import { CreatePostDto, UpdatePostDto } from '../dto/post.main-dto';
import { BlogsRepository } from '../../blogs/infrastructure/blog.repository';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Post } from '../domain/post.entity';
import { PostsRepository } from '../infrastructure/post.repository';

@Injectable()
export class PostsService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    private postsRepository: PostsRepository,
    private blogsRepository: BlogsRepository,
  ) {}

  async create(dto: CreatePostDto): Promise<string> {
    await this.blogsRepository.findByIdOrNotFoundException(dto.blogId);
    const post = Post.createNewInstance(dto);
    return await this.postsRepository.save(post);
  }

  async update(id: string, dto: UpdatePostDto): Promise<void> {
    await this.blogsRepository.findByIdOrNotFoundException(dto.blogId);
    const post = await this.postsRepository.findByIdOrNotFoundException(id);
    post.update(dto);
    await this.postsRepository.save(post);
  }

  async delete(id: string): Promise<void> {
    const post = await this.postsRepository.findByIdOrNotFoundException(id);
    post.flagAsDeleted();
    await this.postsRepository.save(post);
  }

  //async findAllWithBlogId(id: string): Promise<Post[]> {}
}
