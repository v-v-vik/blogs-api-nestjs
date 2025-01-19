import { CreateBlogInputDto } from '../../../src/features/bloggers-platform/blogs/api/dto/blog.input-dto';
import { DeletionStatus } from '../../../src/core/dto/deletion-status.enum';
import { Connection, Types } from 'mongoose';
import { CreatePostInputDto } from '../../../src/features/bloggers-platform/posts/api/dto/post.input-dto';
import { Blog } from '../../../src/features/bloggers-platform/blogs/domain/blog.entity';
import { Post } from '../../../src/features/bloggers-platform/posts/domain/post.entity';

export type BlogMockModel = {
  _id: Types.ObjectId;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
  deletionStatus: DeletionStatus;
};

export type PostMockModel = {
  _id: Types.ObjectId;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: {
    likesCount: number;
    dislikesCount: number;
  };
  deletionStatus: DeletionStatus;
};

export class BlogsTestManager {
  constructor(private databaseConnection: Connection) {}

  createData({
    description,
    name,
    websiteUrl,
  }: {
    description?: string;
    name?: string;
    websiteUrl?: string;
  }): CreateBlogInputDto {
    return {
      description: description ?? 'Some blog description',
      name: name ?? 'Some Blog Name',
      websiteUrl: websiteUrl ?? 'https://some-blog.com/',
    };
  }

  async createBlog(
    data: CreateBlogInputDto,
    count: number = 1,
  ): Promise<BlogMockModel[]> {
    const blogs: BlogMockModel[] = [];
    for (let i = 0; i < count; i++) {
      blogs.push({
        _id: new Types.ObjectId(),
        name: data.name + i,
        description: data.description + i,
        websiteUrl: `https://some-blog${i}.com/`,
        createdAt: new Date().toISOString(),
        isMembership: false,
        deletionStatus: DeletionStatus.NotDeleted,
      });
    }
    await this.databaseConnection.model(Blog.name).insertMany(blogs);
    return blogs;
  }
}

export class PostsTestManager {
  constructor(private databaseConnection: Connection) {}

  createData({
    title,
    content,
    shortDescription,
    blogId,
  }: {
    title?: string;
    content?: string;
    shortDescription?: string;
    blogId: string;
  }): CreatePostInputDto {
    return {
      title: title ?? 'Post title',
      content: content ?? 'Some content',
      shortDescription: shortDescription ?? 'some very short description',
      blogId,
    };
  }

  async createPost(
    blogId: string,
    blogName: string,
    data: CreatePostInputDto,
    count: number = 1,
  ): Promise<PostMockModel[]> {
    const posts: PostMockModel[] = [];
    for (let i = 0; i < count; i++) {
      posts.push({
        _id: new Types.ObjectId(),
        title: data.title + i,
        shortDescription: data.shortDescription + i,
        content: data.content + i,
        blogId,
        blogName,
        createdAt: new Date().toISOString(),
        extendedLikesInfo: {
          likesCount: 0,
          dislikesCount: 0,
        },
        deletionStatus: DeletionStatus.NotDeleted,
      });
    }
    await this.databaseConnection.model(Post.name).insertMany(posts);
    return posts;
  }
}
