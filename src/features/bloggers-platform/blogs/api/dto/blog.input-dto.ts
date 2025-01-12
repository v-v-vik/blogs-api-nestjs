import { CreateBlogDto, UpdateBlogDto } from '../../dto/blog.main-dto';
import { IsNotEmpty, IsString, IsUrl, Length } from 'class-validator';
import { Trim } from '../../../../../core/decorators/trim-decorator';
//dto for body when creating user; swagger's decorators might be added here;

export class CreateBlogInputDto implements CreateBlogDto {
  @IsString()
  @Trim()
  @IsNotEmpty()
  @Length(1, 15)
  name: string;

  @IsString()
  @Trim()
  @IsNotEmpty()
  @Length(1, 500)
  description: string;

  @IsString()
  @Trim()
  @IsNotEmpty()
  @IsUrl()
  @Length(1, 100)
  websiteUrl: string;
}

//dto for body when updating user; swagger's decorators might be added here;

export class UpdateBlogInputDto implements UpdateBlogDto {
  @IsString()
  @Trim()
  @IsNotEmpty()
  @Length(1, 15)
  name: string;

  @IsString()
  @Trim()
  @IsNotEmpty()
  @Length(1, 500)
  description: string;

  @IsString()
  @Trim()
  @IsNotEmpty()
  @IsUrl()
  @Length(1, 100)
  websiteUrl: string;
}
