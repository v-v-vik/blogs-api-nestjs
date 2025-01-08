import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostModelType } from '../domain/post.entity';
import { BlogsRepository } from '../../blogs/infrastructure/blog.repository';
import { PostRepository } from '../infrastructure/post.repository';
import { CreatePostDto, UpdatePostDto } from '../dto/post.main-dto';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { PostViewDto } from '../api/dto/post.view-dto';
import { PostsQueryRepository } from '../infrastructure/post.query-repository';
import { GetPostsQueryParams } from '../api/dto/get-posts-query-params.input-dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private PostModel: PostModelType,
    private postRepository: PostRepository,
    private blogsRepository: BlogsRepository,
    private postsQueryRepository: PostsQueryRepository,
  ) {}

  async create(dto: CreatePostDto): Promise<string> {
    const foundBlog = await this.blogsRepository.findById(dto.blogId);
    if (!foundBlog) {
      throw new NotFoundException('Blog not found.');
    }
    const domainDto = {
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: dto.blogId,
      blogName: foundBlog.name,
    };
    const post = this.PostModel.createInstance(domainDto);
    await this.postRepository.save(post);
    return post._id.toString();
  }

  async update(id: string, dto: UpdatePostDto): Promise<void> {
    const foundBlog = await this.blogsRepository.findById(dto.blogId);
    if (!foundBlog) {
      throw new NotFoundException('Blog not found.');
    }
    const domainDto = {
      ...dto,
      blogName: foundBlog.name,
    };
    const post = await this.postRepository.findById(id);
    if (!post) {
      throw new NotFoundException('Post not found.');
    }
    post.update(domainDto);
    await this.postRepository.save(post);
  }

  async delete(id: string): Promise<void> {
    const post = await this.postRepository.findById(id);
    if (!post) {
      throw new NotFoundException('Post not found.');
    }
    post.flagAsDeleted();
    await this.postRepository.save(post);
  }

  async findAllByBlogId(
    query: GetPostsQueryParams,
    blogId: string,
  ): Promise<PaginatedViewDto<PostViewDto[]>> {
    const foundBlog = await this.blogsRepository.findById(blogId);
    console.log('foundBlog', foundBlog);
    if (!foundBlog) {
      throw new NotFoundException('Blog not found.');
    }
    return this.postsQueryRepository.findAll(query, foundBlog.id);
  }

  //async findAllWithBlogId(id: string): Promise<Post[]> {}
}
