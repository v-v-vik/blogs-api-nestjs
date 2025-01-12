import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Trim } from '../../../../../core/decorators/trim-decorator';

export class CreatePostInputViaBlogDto {
  @IsString()
  @Trim()
  @IsNotEmpty()
  @Length(1, 30)
  title: string;

  @IsString()
  @Trim()
  @IsNotEmpty()
  @Length(1, 100)
  shortDescription: string;

  @IsString()
  @Trim()
  @IsNotEmpty()
  @Length(1, 1000)
  content: string;
}
