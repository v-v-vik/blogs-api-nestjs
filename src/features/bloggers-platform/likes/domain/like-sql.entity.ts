import { DeletionStatus } from '../../../../core/dto/deletion-status.enum';
import { ReactionDomainDto } from './dto/like.domain-dto';
import { NotFoundDomainException } from '../../../../core/exceptions/domain-exceptions';
import { LikeSQLDto } from './dto/like.sql-dto';
import { LikeStatus } from './like.entity';

export enum LikeEntityType {
  Post = 'post',
  Comment = 'comment',
}

export class Like {
  id: string;
  createdAt: Date;
  status: LikeStatus;
  authorId: string;
  parentId: string;
  deletionStatus: DeletionStatus;

  static createNewInstance(dto: ReactionDomainDto) {
    const reaction = new this();
    reaction.status = dto.status;
    reaction.authorId = dto.authorId;
    reaction.parentId = dto.parentId;

    return reaction as Like;
  }

  static createFromExistingDataInstance(dbLike: LikeSQLDto) {
    const reaction = new this();
    reaction.id = dbLike.id.toString();
    reaction.createdAt = dbLike.createdAt;
    reaction.status = dbLike.status;
    reaction.authorId = dbLike.authorId.toString();
    reaction.parentId = dbLike.parentId.toString();
    reaction.deletionStatus = dbLike.deletionStatus;

    return reaction as Like;
  }

  flagAsDeleted() {
    if (this.deletionStatus !== DeletionStatus.NotDeleted) {
      throw NotFoundDomainException.create('Entity already deleted');
    }
    this.deletionStatus = DeletionStatus.PermanentDeleted;
  }
}
