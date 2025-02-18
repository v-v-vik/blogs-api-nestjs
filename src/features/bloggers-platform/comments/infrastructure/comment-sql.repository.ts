import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Comment } from '../domain/comment-sql.entity';
import { NotFoundDomainException } from '../../../../core/exceptions/domain-exceptions';

@Injectable()
export class SQLCommentsRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async create(comment: Comment) {
    const commentValues = [comment.content, comment.userId, comment.postId];
    const res = await this.dataSource.query(
      `INSERT INTO public."comments"
    ("content", "userId", "postId")
    VALUES 
    ($1, $2, $3)
    RETURNING "id"`,
      commentValues,
    );
    return res[0].id.toString();
  }

  async update(comment: Comment) {
    const values = [
      comment.id,
      comment.content,
      comment.userId,
      comment.postId,
      comment.createdAt,
      comment.likesInfo.likesCount,
      comment.likesInfo.dislikesCount,
      comment.deletionStatus,
    ];
    return await this.dataSource.query(
      `UPDATE public."comments"
    SET "content"=$2, "userId"=$3, "postId"=$4, "createdAt"=$5, "likesCount"=$6, "dislikesCount"=$7, "deletionStatus"=$8
    WHERE "id"= $1`,
      values,
    );
  }

  async findByIdOrNotFoundException(id: string) {
    const res = await this.dataSource.query(
      `SELECT c.*, u."login" as "userLogin"
    FROM public."comments" as c
    LEFT JOIN public."users" as u
    ON c."userId" = u."id"    
    WHERE c."id"=$1 AND c."deletionStatus"='not-deleted'`,
      [id],
    );
    if (res.length === 0) {
      throw NotFoundDomainException.create('Comment not found.');
    }
    return Comment.createFromExistingDataInstance(res[0]);
  }
}
