import { DeletionStatus } from '../../../../core/dto/deletion-status.enum';
import {
  CreatePostDomainDto,
  UpdatePostDomainDto,
} from './dto/post.domain-dto';
import { NotFoundDomainException } from '../../../../core/exceptions/domain-exceptions';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Blog } from '../../blogs/domain/blog.entity';
import { LikesInfo } from '../../likes/dto/like.main-dto';
import { PostLike } from '../../likes/domain/like.entity';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

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

  @OneToMany(() => PostLike, (l) => l.post)
  likes: PostLike[];

  static createNewInstance(dto: CreatePostDomainDto): Post {
    const post = new this();
    post.title = dto.title;
    post.shortDescription = dto.shortDescription;
    post.content = dto.content;
    post.blogId = Number(dto.blogId);
    post.createdAt = new Date();
    post.deletionStatus = DeletionStatus.NotDeleted;

    return post as Post;
  }

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
  }
}
