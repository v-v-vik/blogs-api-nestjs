import { LikeStatus } from '../like.entity';

export class ReactionDomainDto {
  status: LikeStatus;
  authorId: string;
  parentId: string;
}
