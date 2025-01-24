import { LikeStatus } from '../like.entity';

export class ReactionDomainDto {
  status: LikeStatus;
  authorId: string;
  authorLogin: string;
  parentId: string;
}
