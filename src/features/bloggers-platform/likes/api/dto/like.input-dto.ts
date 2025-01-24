import { LikeStatus } from '../../domain/like.entity';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Trim } from '../../../../../core/decorators/trim-decorator';

export class ReactionInputDto {
  @IsString()
  @Trim()
  @IsNotEmpty()
  @IsEnum(LikeStatus)
  likeStatus: LikeStatus;
}
