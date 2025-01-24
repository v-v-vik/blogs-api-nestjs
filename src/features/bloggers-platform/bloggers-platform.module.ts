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
import { PostsRepository } from './posts/infrastructure/post.repository';
import { PostsQueryRepository } from './posts/infrastructure/post.query-repository';
import { CommentSchema, Comment } from './comments/domain/comment.entity';
import { CommentsController } from './comments/api/comments.controller';
import { CommentsRepository } from './comments/infrastructure/comment.repository';
import { DeleteCommentUseCase } from './comments/application/useCases/delete-comment.usecase';
import { UpdateCommentUseCase } from './comments/application/useCases/update-comment.usecase';
import { ReactOnEntityUseCase } from './likes/application/useCases/react-on-entity.usecase';
import { Like, LikeSchema } from './likes/domain/like.entity';
import { LikesRepository } from './likes/infrastructure/like.repository';
import { LikeService } from './likes/application/like.service';
import { UserAccountsModule } from '../user-accounts/user-accounts.module';
import { CommentsQueryRepository } from './comments/infrastructure/comments-query.repository';
import { CreateCommentUseCase } from './comments/application/useCases/create-comment.usecase';
import { BlogIdExistsConstraint } from './posts/api/validation/blogIdExists.decorator';

const useCases = [
  UpdateCommentUseCase,
  DeleteCommentUseCase,
  CreateCommentUseCase,
  ReactOnEntityUseCase,
];

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: Like.name, schema: LikeSchema },
    ]),
    UserAccountsModule,
  ],
  controllers: [BlogsController, PostsController, CommentsController],
  providers: [
    BlogsService,
    BlogsRepository,
    BlogsQueryRepository,
    PostsService,
    PostsRepository,
    PostsQueryRepository,
    CommentsRepository,
    CommentsQueryRepository,
    ...useCases,
    // {
    //   provide: CreateCommentUseCase,
    //   //manual way
    //   useFactory: (
    //     postsRepository: PostsRepository,
    //     CommentModel: CommentModelType,
    //   ) => {
    //     return new CreateCommentUseCase(CommentModel, postsRepository);
    //   },
    //   inject: [PostsRepository, getModelToken(Comment.name)],
    // },
    LikesRepository,
    LikeService,
    BlogIdExistsConstraint,
  ],
  exports: [MongooseModule],
})
export class BloggersPlatformModule {}
