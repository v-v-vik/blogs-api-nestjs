// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Post, PostDocument, PostModelType } from '../domain/post.entity';
// import { NewestLikesViewDto, PostViewDto } from '../api/dto/post.view-dto';
// import { GetPostsQueryParams } from '../api/dto/get-posts-query-params.input-dto';
// import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
// import { LikeDocument, LikeStatus } from '../../likes/domain/like.entity';
// import { DeletionStatus } from '../../../../core/dto/deletion-status.enum';
// import { FilterQuery } from 'mongoose';
// import { NotFoundDomainException } from '../../../../core/exceptions/domain-exceptions';
// import { LikesRepository } from '../../likes/infrastructure/like.repository';
// import { MappedReactionsModel } from '../../comments/infrastructure/dto/comment.query-dto';
//
// @Injectable()
// export class PostsQueryRepository {
//   constructor(
//     @InjectModel(Post.name) private PostModel: PostModelType,
//     private likesRepository: LikesRepository,
//   ) {}
//
//   async findByIdOrNotFoundException(
//     id: string,
//     userId?: string,
//   ): Promise<PostViewDto> {
//     const userReaction: LikeStatus = userId
//       ? ((await this.likesRepository.findReactionStatusByUserIdParentId(
//           userId,
//           id,
//         )) ?? LikeStatus.None)
//       : LikeStatus.None;
//     let latestLikes: NewestLikesViewDto[] = [];
//     const foundLatestLikes = await this.likesRepository.findLatestLikes(id);
//     if (foundLatestLikes) {
//       latestLikes = foundLatestLikes.map(
//         (reaction: LikeDocument) => new NewestLikesViewDto(reaction),
//       );
//     }
//     const post = await this.PostModel.findOne({
//       _id: id,
//       deletionStatus: DeletionStatus.NotDeleted,
//     });
//     if (!post) {
//       throw NotFoundDomainException.create('Post not found');
//     }
//     return new PostViewDto(post, userReaction, latestLikes);
//   }
//
//   async findAll(
//     query: GetPostsQueryParams,
//     blogId?: string,
//     userId?: string,
//   ): Promise<PaginatedViewDto<PostViewDto[]>> {
//     let latestLikes: NewestLikesViewDto[] = [];
//     const filter: FilterQuery<Post> = {
//       deletionStatus: DeletionStatus.NotDeleted,
//     };
//     if (blogId) {
//       filter.blogId = blogId;
//     }
//
//     const posts = await this.PostModel.find(filter)
//       .sort({ [query.sortBy]: query.sortDirection })
//       .skip(query.calculateSkip())
//       .limit(query.pageSize);
//     const totalCount = await this.PostModel.countDocuments(filter);
//     let reactionsArray: LikeDocument[] | null = [];
//     let mappedReactions: MappedReactionsModel = {};
//     const postIds = posts.map((item) => item._id.toString());
//     const foundLatestLikes =
//       await this.likesRepository.findAllLikeReactionsByParentId(postIds);
//     if (userId) {
//       reactionsArray = await this.likesRepository.findAllByUserIdParentId(
//         userId,
//         postIds,
//       );
//       if (reactionsArray && reactionsArray.length > 0) {
//         mappedReactions = reactionsArray.reduce((acc, curr) => {
//           acc[curr.parentId] = curr.status;
//           return acc;
//         }, {});
//       }
//     }
//     const items = posts.map((post: PostDocument) => {
//       const userReaction: LikeStatus =
//         mappedReactions[post._id.toString()] || LikeStatus.None;
//       if (foundLatestLikes) {
//         const postLatestLikes = foundLatestLikes.filter(
//           (reaction) => reaction.parentId === post._id.toString(),
//         );
//         latestLikes = postLatestLikes
//           .map((reaction: LikeDocument) => new NewestLikesViewDto(reaction))
//           .slice(0, 3);
//       }
//       return new PostViewDto(post, userReaction, latestLikes);
//     });
//     return PaginatedViewDto.mapToView({
//       items,
//       totalCount,
//       page: query.pageNumber,
//       size: query.pageSize,
//     });
//   }
// }
