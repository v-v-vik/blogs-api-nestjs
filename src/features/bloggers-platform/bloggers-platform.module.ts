import { Module } from '@nestjs/common';
import { BlogsController } from './blogs/api/blogs.controller';
import { BlogsService } from './blogs/application/blogs.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsController } from './posts/api/posts.controller';
import { PostsService } from './posts/application/posts.service';
import { CommentsController } from './comments/api/comments.controller';
import { DeleteCommentUseCase } from './comments/application/useCases/delete-comment.usecase';
import { UpdateCommentUseCase } from './comments/application/useCases/update-comment.usecase';
import { LikeService } from './likes/application/like.service';
import { UserAccountsModule } from '../user-accounts/user-accounts.module';
import { CreateCommentUseCase } from './comments/application/useCases/create-comment.usecase';
import { BlogIdExistsConstraint } from './posts/api/validation/blogIdExists.decorator';
import { SQLBlogsQueryRepository } from './blogs/infrastructure/blog-sql.query-repository';
import { SQLBlogsRepository } from './blogs/infrastructure/blog-sql.repository';
import { SQLPostsQueryRepository } from './posts/infrastructure/post-sql.query-repository';
import { SQLPostsRepository } from './posts/infrastructure/post-sql.repository';
import { SuperAdminBlogsController } from './blogs/api/blogs.sa-controller';
import { SQLCommentsRepository } from './comments/infrastructure/comment-sql.repository';
import { SQLCommentsQueryRepository } from './comments/infrastructure/comment-sql.query-repository';
import { SQLLikesRepository } from './likes/infrastructure/like-sql.repository';
import { ReactOnCommentUseCase } from './likes/application/useCases/react-on-comment.usercase';
import { ReactOnPostUseCase } from './likes/application/useCases/react-on-post.usecase';

const useCases = [
  UpdateCommentUseCase,
  DeleteCommentUseCase,
  CreateCommentUseCase,
  //ReactOnEntityUseCase,
  ReactOnPostUseCase,
  ReactOnCommentUseCase,
];

@Module({
  imports: [
    MongooseModule.forFeature([
      //{ name: Blog.name, schema: BlogSchema },
      //{ name: Post.name, schema: PostSchema },
      //{ name: Comment.name, schema: CommentSchema },
      //{ name: Like.name, schema: LikeSchema },
    ]),
    UserAccountsModule,
  ],
  controllers: [
    BlogsController,
    SuperAdminBlogsController,
    PostsController,
    CommentsController,
  ],
  providers: [
    BlogsService,
    //BlogsRepository,
    //BlogsQueryRepository,
    PostsService,
    //PostsRepository,
    //PostsQueryRepository,
    //CommentsRepository,
    //CommentsQueryRepository,
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
    //LikesRepository,
    LikeService,
    BlogIdExistsConstraint,
    SQLBlogsRepository,
    SQLBlogsQueryRepository,
    SQLPostsRepository,
    SQLPostsQueryRepository,
    SQLCommentsRepository,
    SQLCommentsQueryRepository,
    SQLLikesRepository,
  ],
  exports: [MongooseModule],
})
export class BloggersPlatformModule {}
