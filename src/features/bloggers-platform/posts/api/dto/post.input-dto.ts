import { CreatePostDto, UpdatePostDto } from '../../dto/post.main-dto';

export class CreatePostInputDto implements CreatePostDto {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
}

export class UpdatePostInputDto implements UpdatePostDto {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
}
