import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Trim } from '../../../../../core/decorators/trim-decorator';

export class CreateCommentInputDto {
  @IsString()
  @Trim()
  @IsNotEmpty()
  @Length(20, 300)
  content: string;
}

export class UpdateCommentInputDto {
  @IsString()
  @Trim()
  @IsNotEmpty()
  @Length(20, 300)
  content: string;
}
