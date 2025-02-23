import { DeletionStatus } from '../../../../core/dto/deletion-status.enum';
import {
  CreateBlogDomainDto,
  UpdateBlogDomainDto,
} from './dto/blog.domain-dto';
import { NotFoundDomainException } from '../../../../core/exceptions/domain-exceptions';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('blogs')
export class Blog {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({
    type: 'varchar',
    nullable: false,
    collation: 'C',
  })
  name: string;
  @Column({
    type: 'varchar',
    nullable: false,
  })
  description: string;
  @Column({
    type: 'varchar',
    nullable: false,
  })
  websiteUrl: string;
  @Column({
    type: 'timestamp with time zone',
    nullable: false,
  })
  createdAt: Date;
  @Column({
    type: 'boolean',
    nullable: false,
  })
  isMembership: boolean;
  @Column({
    type: 'varchar',
    nullable: false,
  })
  deletionStatus: string;

  static createNewInstance(dto: CreateBlogDomainDto): Blog {
    const blog = new this();
    blog.name = dto.name;
    blog.description = dto.description;
    blog.websiteUrl = dto.websiteUrl;
    blog.createdAt = new Date();
    blog.isMembership = false;
    blog.deletionStatus = DeletionStatus.NotDeleted;

    return blog as Blog;
  }

  // static createFromExistingDataInstance(dbBlog: BlogSQLDto) {
  //   const blog = new this();
  //   blog.id = dbBlog.id.toString();
  //   blog.name = dbBlog.name;
  //   blog.description = dbBlog.description;
  //   blog.websiteUrl = dbBlog.websiteUrl;
  //   blog.createdAt = dbBlog.createdAt;
  //   blog.isMembership = dbBlog.isMembership;
  //   blog.deletionStatus = dbBlog.deletionStatus;
  //
  //   return blog as Blog;
  // }

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
