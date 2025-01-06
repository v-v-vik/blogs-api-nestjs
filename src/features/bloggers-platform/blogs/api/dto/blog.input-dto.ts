import { CreateBlogDto, UpdateBlogDto } from '../../dto/blog.main-dto';
//dto for body when creating user; swagger's decorators might be added here;

export class CreateBlogInputDto implements CreateBlogDto {
  name: string;
  description: string;
  websiteUrl: string;
}

//dto for body when updating user; swagger's decorators might be added here;

export class UpdateBlogInputDto implements UpdateBlogDto {
  name: string;
  description: string;
  websiteUrl: string;
}
