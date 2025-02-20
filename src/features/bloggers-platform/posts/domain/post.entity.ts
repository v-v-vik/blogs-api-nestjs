import { DeletionStatus } from '../../../../core/dto/deletion-status.enum';
import {
  CreatePostDomainDto,
  UpdatePostDomainDto,
} from './dto/post.domain-dto';
import { NotFoundDomainException } from '../../../../core/exceptions/domain-exceptions';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Blog } from '../../blogs/domain/blog.entity';
import { LikesInfo } from '../../likes/dto/like.main-dto';
import { Like } from '../../likes/domain/like.entity';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  title: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  shortDescription: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  content: string;

  @ManyToOne(() => Blog, { nullable: false, onDelete: 'CASCADE' })
  blog: Blog;

  @Column({ type: 'int' })
  blogId: number;

  @Column({
    type: 'timestamp with time zone',
    nullable: false,
  })
  createdAt: Date;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  deletionStatus: string;

  @Column({ type: 'int', default: 0 })
  likesCount: number;

  @Column({ type: 'int', default: 0 })
  dislikesCount: number;

  @OneToMany(() => Like, (l) => l.post)
  likes: Like[];

  // extendedLikesInfo: {
  //   likesCount: number;
  //   dislikesCount: number;
  // };
  //
  // @AfterLoad()
  // setExtendedLikesInfo() {
  //   this.extendedLikesInfo = {
  //     likesCount: this.likesCount,
  //     dislikesCount: this.dislikesCount,
  //   };
  // }

  static createNewInstance(dto: CreatePostDomainDto): Post {
    const post = new this();
    post.title = dto.title;
    post.shortDescription = dto.shortDescription;
    post.content = dto.content;
    post.blogId = Number(dto.blogId);

    return post as Post;
  }

  // static createFromExistingDataInstance(dbPost: PostSQLDto): Post {
  //   const post = new this();
  //   post.id = dbPost.id.toString();
  //   post.title = dbPost.title;
  //   post.shortDescription = dbPost.shortDescription;
  //   post.content = dbPost.content;
  //   post.blogId = dbPost.blogId.toString();
  //   post.blogName = dbPost.blogName;
  //   post.createdAt = dbPost.createdAt;
  //   post.extendedLikesInfo = {
  //     likesCount: dbPost.likesCount,
  //     dislikesCount: dbPost.dislikesCount,
  //   };
  //   post.deletionStatus = dbPost.deletionStatus;
  //
  //   return post as Post;
  // }

  flagAsDeleted() {
    if (this.deletionStatus !== DeletionStatus.NotDeleted) {
      throw NotFoundDomainException.create('Entity already deleted');
    }
    this.deletionStatus = DeletionStatus.PermanentDeleted;
  }

  update(dto: UpdatePostDomainDto) {
    this.title = dto.title;
    this.shortDescription = dto.shortDescription;
    this.content = dto.content;
    this.blogId = Number(dto.blogId);
  }

  updateLikeCount(dto: LikesInfo) {
    this.likesCount = dto.likesCount;
    this.dislikesCount = dto.dislikesCount;

    // this.extendedLikesInfo = {
    //   likesCount: dto.likesCount,
    //   dislikesCount: dto.dislikesCount,
  }
}
