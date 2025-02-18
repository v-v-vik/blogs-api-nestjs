import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Blog } from '../domain/blog-sql.entity';
import { NotFoundDomainException } from '../../../../core/exceptions/domain-exceptions';

@Injectable()
export class SQLBlogsRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async create(blog: Blog): Promise<string> {
    const blogValues = [blog.name, blog.description, blog.websiteUrl];
    const res = await this.dataSource.query(
      `INSERT INTO public."blogs"
    ("name", "description", "websiteUrl")
    VALUES 
    ($1, $2, $3)
    RETURNING "id"`,
      blogValues,
    );
    return res[0].id;
  }

  async update(blog: Blog): Promise<void> {
    const values = [
      blog.id,
      blog.name,
      blog.description,
      blog.websiteUrl,
      blog.createdAt,
      blog.isMembership,
      blog.deletionStatus,
    ];
    return await this.dataSource.query(
      `UPDATE public."blogs"
    SET "name"=$2, "description"=$3, "websiteUrl"=$4, "createdAt"=$5, "isMembership"=$6, "deletionStatus"=$7
    WHERE "id"= $1`,
      values,
    );
  }

  async findByIdOrNotFoundException(id: string): Promise<Blog> {
    const res = await this.dataSource.query(
      `SELECT *
     FROM public."blogs"
     WHERE "id" = $1 AND "deletionStatus" = 'not-deleted'`,
      [id],
    );
    if (res.length === 0) {
      throw NotFoundDomainException.create('Blog not found.');
    }
    return Blog.createFromExistingDataInstance(res[0]);
  }
}
