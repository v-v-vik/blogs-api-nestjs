import { Connection, Types } from 'mongoose';

export type CommentMockModel = {
  _id: Types.ObjectId;
  content: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  createdAt: string;
  postId: string;
  likesInfo: {
    likesCount: number;
    dislikesCount: number;
  };
};

export class CommentsTestManager {
  constructor(private databaseConnection: Connection) {}

  async createComment(
    userId: string,
    userLogin: string,
    postId: string,
    count: number = 1,
    content?: string,
  ) {
    const comments: CommentMockModel[] = [];
    for (let i = 0; i < count; i++) {
      comments.push({
        _id: new Types.ObjectId(),
        content: content ?? 'some long and very interesting content' + i,
        commentatorInfo: {
          userId: userId,
          userLogin: userLogin,
        },
        createdAt: new Date().toISOString(),
        postId,
        likesInfo: {
          likesCount: 0,
          dislikesCount: 0,
        },
      });
    }
    await this.databaseConnection.model(Comment.name).insertMany(comments);
    return comments;
  }
}
