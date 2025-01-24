import { LikeStatus } from '../../../likes/domain/like.entity';

export class MappedReactionsModel {
  [id: string]: LikeStatus;
}
