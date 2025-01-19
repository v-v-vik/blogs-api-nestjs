import { Module } from '@nestjs/common';
import { BlogsController } from './blogs/api/blogs.controller';
import { BlogsService } from './blogs/application/blogs.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './blogs/domain/blog.entity';
import { BlogsRepository } from './blogs/infrastructure/blog.repository';
import { BlogsQueryRepository } from './blogs/infrastructure/blog.query-repository';
import { PostsController } from './posts/api/posts.controller';
import { PostsService } from './posts/application/posts.service';
import { Post, PostSchema } from './posts/domain/post.entity';
import { PostRepository } from './posts/infrastructure/post.repository';
import { PostsQueryRepository } from './posts/infrastructure/post.query-repository';
import { CommentSchema } from './comments/domain/comment.entity';
import { CommentsController } from './comments/api/comments.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
      { name: Comment.name, schema: CommentSchema },
    ]),
  ],
  controllers: [BlogsController, PostsController, CommentsController],
  providers: [
    BlogsService,
    BlogsRepository,
    BlogsQueryRepository,
    PostsService,
    PostRepository,
    PostsQueryRepository,
  ],
  exports: [MongooseModule],
})
export class BloggersPlatformModule {}
