import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Post } from '../domain/post-sql.entity';
import { NotFoundDomainException } from '../../../../core/exceptions/domain-exceptions';

@Injectable()
export class SQLPostsRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async create(post: Post) {
    const postValues = [
      post.title,
      post.shortDescription,
      post.content,
      post.blogId,
    ];
    const res = await this.dataSource.query(
      `INSERT INTO public."posts"
    ("title", "shortDescription", "content", "blogId")
    VALUES 
    ($1, $2, $3, $4)
    RETURNING "id"`,
      postValues,
    );
    return res[0].id;
  }

  async update(post: Post) {
    const values = [
      post.id,
      post.title,
      post.shortDescription,
      post.content,
      post.blogId,
      post.createdAt,
      post.extendedLikesInfo.likesCount,
      post.extendedLikesInfo.dislikesCount,
      post.deletionStatus,
    ];
    return await this.dataSource.query(
      `UPDATE public."posts"
    SET "title"=$2, "shortDescription"=$3, "content"=$4, "blogId"=$5, "createdAt"=$6, "likesCount"=$7, "dislikesCount"=$8, "deletionStatus"=$9
    WHERE "id"= $1`,
      values,
    );
  }

  async findByIdOrNotFoundException(id: string): Promise<Post> {
    const res = await this.dataSource.query(
      `SELECT p.*, b."name" as "blogName"
    FROM public."posts" as p
    LEFT JOIN public."blogs" as b
    ON p."blogId" = b."id"
    WHERE p."id"=$1 AND p."deletionStatus"='not-deleted'`,
      [id],
    );
    if (res.length === 0) {
      throw NotFoundDomainException.create('Post not found.');
    }
    return Post.createFromExistingDataInstance(res[0]);
  }
}
