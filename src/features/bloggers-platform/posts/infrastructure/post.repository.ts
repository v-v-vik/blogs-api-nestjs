import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../domain/post.entity';
import { NotFoundDomainException } from '../../../../core/exceptions/domain-exceptions';
import { DeletionStatus } from '../../../../core/dto/deletion-status.enum';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectRepository(Post) private postsRepo: Repository<Post>,
  ) {}

  async findByIdOrNotFoundException(id: string): Promise<Post> {
    const res = await this.postsRepo
      .createQueryBuilder('post')
      .leftJoin('post.blog', 'blog')
      .addSelect('blog.name')
      .where('post.id = :id', { id })
      .andWhere('post.deletionStatus = :status', {
        status: DeletionStatus.NotDeleted,
      })
      .printSql()
      .getOne();
    console.log(res);

    if (!res) {
      throw NotFoundDomainException.create('Post not found.');
    }
    return res;
  }

  async save(post: Post): Promise<string> {
    const res = await this.postsRepo.save(post);
    return res.id.toString();
  }
}
