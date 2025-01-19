export class CreateCommentDomainDto {
  content: string;
  userId: string;
  userLogin: string;
  createdAt: string;
  postId: string;
}

export class UpdateCommentDomainDto {
  content: string;
}
