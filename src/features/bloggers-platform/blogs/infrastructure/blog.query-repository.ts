import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogViewDto } from '../api/dto/blog.view-dto';
import { NotFoundDomainException } from '../../../../core/exceptions/domain-exceptions';
import { GetBlogsQueryParams } from '../api/dto/get-blogs-query-params.input-dto';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { Injectable } from '@nestjs/common';
import { DeletionStatus } from '../../../../core/dto/deletion-status.enum';
import { Blog } from '../domain/blog.entity';
import { SortDirection } from '../../../../core/dto/base.query-params.input-dto';

@Injectable()
export class BlogsQueryRepository {
  constructor(@InjectRepository(Blog) private blogsRepo: Repository<Blog>) {}

  async findByIdOrNotFoundException(id: string): Promise<BlogViewDto> {
    const res = await this.blogsRepo
      .createQueryBuilder('blogs')
      .where('blogs.id = :id', { id })
      .andWhere('blogs.deletionStatus = :status', {
        status: DeletionStatus.NotDeleted,
      })
      .getOne();
    if (!res) {
      throw NotFoundDomainException.create('Blog not found.');
    }
    return new BlogViewDto(res);
  }

  async findAll(
    query: GetBlogsQueryParams,
  ): Promise<PaginatedViewDto<BlogViewDto[]>> {
    const sortDirection: 'ASC' | 'DESC' =
      query.sortDirection === SortDirection.Asc ? 'ASC' : 'DESC';
    const searchName = query.searchNameTerm
      ? `%${query.searchNameTerm}%`
      : '%%';

    const searchResult = await this.blogsRepo
      .createQueryBuilder('blogs')
      .where('blogs.name ILIKE :name', { name: searchName })
      .andWhere('blogs.deletionStatus = :status', {
        status: DeletionStatus.NotDeleted,
      })
      .orderBy(`blogs.${query.sortBy}`, sortDirection)
      .limit(query.pageSize)
      .offset(query.calculateSkip())
      .getMany();

    const items = searchResult.map((blog: Blog) => new BlogViewDto(blog));

    const totalCount = await this.blogsRepo
      .createQueryBuilder('blogs')
      .where('blogs.name = :name', { name: searchName })
      .andWhere('blogs.deletionStatus = :status', {
        status: DeletionStatus.NotDeleted,
      })
      .getCount();

    return PaginatedViewDto.mapToView({
      items,
      totalCount: totalCount,
      page: query.pageNumber,
      size: query.pageSize,
    });
  }
}
