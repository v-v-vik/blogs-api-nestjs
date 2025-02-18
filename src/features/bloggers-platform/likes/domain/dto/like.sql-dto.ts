import { DeletionStatus } from '../../../../../core/dto/deletion-status.enum';
import { LikeStatus } from '../like.entity';

export class LikeSQLDto {
  id: number;
  status: LikeStatus;
  authorId: number;
  authorLogin: string;
  parentId: number;
  parentType: string;
  createdAt: Date;
  deletionStatus: DeletionStatus;
}
