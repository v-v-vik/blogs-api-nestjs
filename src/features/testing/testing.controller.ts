import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserModelType } from '../user-accounts/domain/user.entity';
import {
  Blog,
  BlogModelType,
} from '../bloggers-platform/blogs/domain/blog.entity';
import {
  Post,
  PostModelType,
} from '../bloggers-platform/posts/domain/post.entity';
import {
  CommentModelType,
  Comment,
} from '../bloggers-platform/comments/domain/comment.entity';
import {
  Like,
  LikeModelType,
} from '../bloggers-platform/likes/domain/like.entity';
import {
  Session,
  SessionModelType,
} from '../user-accounts/sessions/domain/session.entity';

@Controller('testing')
export class TestingController {
  constructor(
    @InjectModel(User.name)
    private UserModel: UserModelType,
    @InjectModel(Blog.name)
    private BlogModel: BlogModelType,
    @InjectModel(Post.name)
    private PostModel: PostModelType,
    @InjectModel(Comment.name)
    private CommentModel: CommentModelType,
    @InjectModel(Like.name)
    private LikeModel: LikeModelType,
    @InjectModel(Session.name)
    private SessionModel: SessionModelType,
  ) {}

  @Delete('all-data')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAll() {
    await this.UserModel.collection.drop();
    await this.BlogModel.collection.drop();
    await this.PostModel.collection.drop();
    await this.LikeModel.collection.drop();
    await this.CommentModel.collection.drop();
    await this.SessionModel.collection.drop();
  }
}
