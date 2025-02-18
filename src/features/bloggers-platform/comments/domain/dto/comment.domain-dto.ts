export class CreateCommentDomainDto {
  content: string;
  userId: string;
  postId: string;
}

export class UpdateCommentDomainDto {
  content: string;
}
