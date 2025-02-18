import { DeletionStatus } from '../../../../core/dto/deletion-status.enum';
import {
  CreateBlogDomainDto,
  UpdateBlogDomainDto,
} from './dto/blog.domain-dto';
import { NotFoundDomainException } from '../../../../core/exceptions/domain-exceptions';
import { BlogSQLDto } from './dto/blog.sql-dto';

export class Blog {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: Date;
  isMembership: boolean;
  deletionStatus: string;

  static createNewInstance(dto: CreateBlogDomainDto): Blog {
    const blog = new this();
    blog.name = dto.name;
    blog.description = dto.description;
    blog.websiteUrl = dto.websiteUrl;

    return blog as Blog;
  }

  static createFromExistingDataInstance(dbBlog: BlogSQLDto) {
    const blog = new this();
    blog.id = dbBlog.id.toString();
    blog.name = dbBlog.name;
    blog.description = dbBlog.description;
    blog.websiteUrl = dbBlog.websiteUrl;
    blog.createdAt = dbBlog.createdAt;
    blog.isMembership = dbBlog.isMembership;
    blog.deletionStatus = dbBlog.deletionStatus;

    return blog as Blog;
  }

  flagAsDeleted() {
    if (this.deletionStatus !== DeletionStatus.NotDeleted) {
      throw NotFoundDomainException.create('Entity already deleted');
    }
    this.deletionStatus = DeletionStatus.PermanentDeleted;
  }

  update(dto: UpdateBlogDomainDto) {
    this.name = dto.name;
    this.description = dto.description;
    this.websiteUrl = dto.websiteUrl;
  }
  //changeMembershipStatus()
}
