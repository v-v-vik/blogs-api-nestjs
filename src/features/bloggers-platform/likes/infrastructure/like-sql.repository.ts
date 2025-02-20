import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Like, LikeEntityType } from '../domain/like.entity';
import { NotFoundDomainException } from '../../../../core/exceptions/domain-exceptions';

@Injectable()
export class SQLLikesRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async create(like: Like, entityType: LikeEntityType) {
    const likeValues = [like.status, like.authorId, like.parentId, entityType];
    const res = await this.dataSource.query(
      `INSERT INTO public."likes"
    ("status", "authorId", "parentId", "parentType")
    VALUES 
    ($1, $2, $3, $4)
    RETURNING "id"`,
      likeValues,
    );
    return res[0].id;
  }

  async update(like: Like) {
    const values = [
      like.id,
      like.status,
      like.createdAt,
      like.authorId,
      like.parentId,
      like.deletionStatus,
    ];
    return await this.dataSource.query(
      `UPDATE public."likes"
    SET "status"=$2, "createdAt"=$3, "authorId"=$4, "parentId"=$5, "deletionStatus"=$6
    WHERE "id"= $1`,
      values,
    );
  }

  async findReactionOrNoFoundException(
    userId: string,
    parentId: string,
    entityType: LikeEntityType,
  ) {
    console.log(userId, parentId, entityType);
    const res = await this.dataSource.query(
      `SELECT l.*
    FROM public."likes" as l     
    WHERE "authorId"=$1 AND "parentId"=$2 AND "parentType"=$3 AND "deletionStatus"='not-deleted'`,
      [userId, parentId, entityType],
    );
    if (res.length === 0) {
      console.log('leaving when could not find reaction');
      throw NotFoundDomainException.create('Reaction not found.');
    }
    return Like.createFromExistingDataInstance(res[0]);
  }

  async findReactionStatusByUserIdParentId(
    userId: string,
    parentId: string,
    entityType: LikeEntityType,
  ) {
    const res = await this.dataSource.query(
      `SELECT l.*
    FROM public."likes" as l     
    WHERE "authorId"=$1 AND "parentId"=$2 AND "parentType"=$3 AND "deletionStatus"='not-deleted'`,
      [userId, parentId, entityType],
    );
    if (res.length === 0) {
      return null;
    }
    return res[0].status;

    //used by react-on-entity.usecase
  }

  // async findAllByUserIdParentId() {}
  // async findLatestLikes() {}
  // async findAllLikeReactionsByParentId() {}
}
