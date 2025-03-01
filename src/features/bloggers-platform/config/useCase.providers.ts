import { UpdateCommentUseCase } from '../comments/application/useCases/update-comment.usecase';
import { DeleteCommentUseCase } from '../comments/application/useCases/delete-comment.usecase';
import { CreateCommentUseCase } from '../comments/application/useCases/create-comment.usecase';
import { ReactOnPostUseCase } from '../likes/application/useCases/react-on-post.usecase';
import { ReactOnCommentUseCase } from '../likes/application/useCases/react-on-comment.usercase';

export const bloggersUseCaseProviders = [
  UpdateCommentUseCase,
  DeleteCommentUseCase,
  CreateCommentUseCase,
  //ReactOnEntityUseCase,
  ReactOnPostUseCase,
  ReactOnCommentUseCase,
];

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
