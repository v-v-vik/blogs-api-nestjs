export class BlogViewModel {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
}

export class CreateBlogModel {
  name: string;
  description: string;
  websiteUrl: string;
}

export class UpdateBlogModel {
  name: string;
  description: string;
  websiteUrl: string;
}
