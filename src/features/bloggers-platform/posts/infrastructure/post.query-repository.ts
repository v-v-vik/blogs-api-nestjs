import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument, PostModelType } from '../domain/post.entity';
import { NewestLikesViewDto, PostViewDto } from '../api/dto/post.view-dto';
import { GetPostsQueryParams } from '../api/dto/get-posts-query-params.input-dto';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { LikeStatus } from '../../likes/domain/like.entity';
import { DeletionStatus } from '../../../../core/dto/deletion-status.enum';
import { FilterQuery } from 'mongoose';

@Injectable()
export class PostsQueryRepository {
  constructor(@InjectModel(Post.name) private PostModel: PostModelType) {}

  async findById(id: string): Promise<PostViewDto | null> {
    const userReaction: LikeStatus = LikeStatus.None;
    const latestLikes: NewestLikesViewDto[] = [];
    const post = await this.PostModel.findOne({
      _id: id,
      deletionStatus: DeletionStatus.NotDeleted,
    });
    if (!post) {
      return null;
    }
    return new PostViewDto(post, userReaction, latestLikes);
  }

  async findAll(
    query: GetPostsQueryParams,
    blogId?: string,
  ): Promise<PaginatedViewDto<PostViewDto[]>> {
    const userReaction: LikeStatus = LikeStatus.None;
    const latestLikes: NewestLikesViewDto[] = [];
    const filter: FilterQuery<Post> = {
      deletionStatus: DeletionStatus.NotDeleted,
    };
    if (blogId) {
      filter.blogId = blogId;
    }
    const posts = await this.PostModel.find(filter)
      .sort({ [query.sortBy]: query.sortDirection })
      .skip(query.calculateSkip())
      .limit(query.pageSize);
    const totalCount = await this.PostModel.countDocuments(filter);
    const items = posts.map(
      (post: PostDocument) => new PostViewDto(post, userReaction, latestLikes),
    );
    return PaginatedViewDto.mapToView({
      items,
      totalCount,
      page: query.pageNumber,
      size: query.pageSize,
    });
  }
}
