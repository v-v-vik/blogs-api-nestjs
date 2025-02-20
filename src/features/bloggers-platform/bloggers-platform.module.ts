import { Module } from '@nestjs/common';
import { BlogsController } from './blogs/api/blogs.controller';
import { BlogsService } from './blogs/application/blogs.service';
import { PostsController } from './posts/api/posts.controller';
import { PostsService } from './posts/application/posts.service';
import { CommentsController } from './comments/api/comments.controller';
import { LikeService } from './likes/application/like.service';
import { UserAccountsModule } from '../user-accounts/user-accounts.module';
import { BlogIdExistsConstraint } from './posts/api/validation/blogIdExists.decorator';
import { BlogsQueryRepository } from './blogs/infrastructure/blog.query-repository';
import { BlogsRepository } from './blogs/infrastructure/blog.repository';
import { PostsQueryRepository } from './posts/infrastructure/post.query-repository';
import { PostsRepository } from './posts/infrastructure/post.repository';
import { SuperAdminBlogsController } from './blogs/api/blogs.sa-controller';
import { SQLCommentsRepository } from './comments/infrastructure/comment-sql.repository';
import { SQLCommentsQueryRepository } from './comments/infrastructure/comment-sql.query-repository';
import { SQLLikesRepository } from './likes/infrastructure/like-sql.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from './blogs/domain/blog.entity';
import { Like } from './likes/domain/like.entity';
import { Post } from './posts/domain/post.entity';
import { Comment } from './comments/domain/comment.entity';
import { bloggersUseCaseProviders } from './config/useCase.providers';

@Module({
  imports: [
    TypeOrmModule.forFeature([Blog, Post, Comment, Like]),
    UserAccountsModule,
  ],
  controllers: [
    BlogsController,
    SuperAdminBlogsController,
    PostsController,
    CommentsController,
  ],
  providers: [
    ...bloggersUseCaseProviders,
    BlogsService,
    PostsService,
    LikeService,
    BlogIdExistsConstraint,
    BlogsRepository,
    BlogsQueryRepository,
    PostsRepository,
    PostsQueryRepository,
    SQLCommentsRepository,
    SQLCommentsQueryRepository,
    SQLLikesRepository,
  ],
  exports: [TypeOrmModule],
})
export class BloggersPlatformModule {}
