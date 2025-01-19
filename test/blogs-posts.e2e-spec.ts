import { INestApplication } from '@nestjs/common';
import {
  BlogMockModel,
  BlogsTestManager,
} from './helpers/entities manager/blog-post.creator';
import { initSettings } from './helpers/init-settings';
import { JwtService } from '@nestjs/jwt';
import { deleteAllData } from './helpers/delete-all-data';
import request from 'supertest';
import { BlogViewDto } from '../src/features/bloggers-platform/blogs/api/dto/blog.view-dto';

function encodeAuth() {
  const buff = Buffer.from('admin:qwerty', 'utf8');
  return buff.toString('base64');
}

describe('blogs', () => {
  let app: INestApplication;
  let blogsTestManager: BlogsTestManager;

  beforeAll(async () => {
    const result = await initSettings((moduleBuilder) =>
      moduleBuilder.overrideProvider(JwtService).useValue(
        new JwtService({
          secret: 'access-token-secret', //TODO: move to env
          signOptions: { expiresIn: '2s' },
        }),
      ),
    );
    app = result.app;
    blogsTestManager = result.blogsTestManager;
    await deleteAllData(app);
  });

  afterAll(async () => {
    await deleteAllData(app);
    await app.close();
  });

  beforeEach(async () => {});

  describe('create/update blog', () => {
    beforeAll(async () => {
      await deleteAllData(app);
    });

    let newBlog: BlogViewDto;
    let updatedBlog: BlogViewDto;
    it('should create blog', async () => {
      const newData = blogsTestManager.createData({});

      const res = await request(app.getHttpServer())
        .post('/blogs')
        .set({ Authorization: 'Basic ' + encodeAuth() })
        .send(newData);

      newBlog = res.body;

      expect(newBlog).toEqual({
        id: expect.any(String),
        name: newData.name,
        description: newData.description,
        websiteUrl: newData.websiteUrl,
        createdAt: expect.any(String),
        isMembership: false,
      });
    });

    it('should update blog', async () => {
      const updData = blogsTestManager.createData({
        description: 'upd Description',
        name: 'upd Name',
      });

      const res = await request(app.getHttpServer())
        .put(`/blogs/${newBlog.id}`)
        .set({ Authorization: 'Basic ' + encodeAuth() })
        .send(updData);

      updatedBlog = res.body;

      expect(updatedBlog).not.toEqual(newBlog);
    });

    it('should return 400 when creating blog with wrong format', async () => {
      await request(app.getHttpServer())
        .post('/blogs')
        .set({ Authorization: 'Basic ' + encodeAuth() })
        .send({
          description: 12321,
          name: 'Some Blog Name',
          websiteUrl: 'https://some-blog.com/',
        })
        .expect(400);
    });

    it('should return 401 when creating blog with no authentication', async () => {
      await request(app.getHttpServer())
        .post('/blogs')
        .set({ Authorization: 'Basic ' + '8734982793847' })
        .send(blogsTestManager.createData({}))
        .expect(401);
    });

    it('should return 401 when updating blog with no authentication', async () => {
      await request(app.getHttpServer())
        .put(`/blogs/${newBlog.id}`)
        .set({ Authorization: 'Basic ' + '8734982793847' })
        .send(blogsTestManager.createData({}))
        .expect(401);
    });

    it('should return 400 when updating blog with wrong format', async () => {
      await request(app.getHttpServer())
        .put(`/blogs/${newBlog.id}`)
        .set({ Authorization: 'Basic ' + encodeAuth() })
        .send({
          description: 12321,
          name: 'Some Blog Name',
          websiteUrl: 'https://some-blog.com/',
        })
        .expect(400);
    });

    it('should return 404 when updating blog with wrong id', async () => {
      await request(app.getHttpServer())
        .put(`/blogs/678b8f1f9cf721ba0966081c`)
        .set({ Authorization: 'Basic ' + encodeAuth() })
        .send(blogsTestManager.createData({}))
        .expect(404);
    });
  });

  describe('get/delete blog', () => {
    beforeAll(async () => {
      await deleteAllData(app);
    });

    let newBlog: BlogMockModel[];

    it('should get empty paginator', async () => {
      await request(app.getHttpServer()).get('/blogs').expect(200, {
        pagesCount: 0,
        page: 1,
        pageSize: 10,
        totalCount: 0,
        items: [],
      });
    });

    it('should get paginator with a new blog in it', async () => {
      newBlog = await blogsTestManager.createBlog(
        blogsTestManager.createData({}),
      );
      await request(app.getHttpServer())
        .get('/blogs')
        .expect(200, {
          pagesCount: 1,
          page: 1,
          pageSize: 10,
          totalCount: 1,
          items: [
            {
              id: newBlog[0]._id.toString(),
              name: newBlog[0].name,
              description: newBlog[0].description,
              websiteUrl: newBlog[0].websiteUrl,
              createdAt: newBlog[0].createdAt,
              isMembership: newBlog[0].isMembership,
            },
          ],
        });
    });

    it('should get blog by id', async () => {
      const res = await request(app.getHttpServer())
        .get(`/blogs/${newBlog[0]._id.toString()}`)
        .expect(200);
      expect(res.body).toEqual({
        id: newBlog[0]._id.toString(),
        name: newBlog[0].name,
        description: newBlog[0].description,
        websiteUrl: newBlog[0].websiteUrl,
        createdAt: newBlog[0].createdAt,
        isMembership: newBlog[0].isMembership,
      });
    });

    it('should return 404 when getting blog by wrong id', async () => {
      await request(app.getHttpServer())
        .get(`/blogs/678b8f1f9cf721ba0966081c`)
        .expect(404);
    });

    it('should return 404 when trying to delete blog with wrong id', async () => {
      await request(app.getHttpServer())
        .delete(`/blogs/678b8f1f9cf721ba0966081c`)
        .set({ Authorization: 'Basic ' + encodeAuth() })
        .expect(404);
    });

    it('should return 401 when deleting blog with no authentication', async () => {
      await request(app.getHttpServer())
        .delete(`/blogs/${newBlog[0]._id.toString()}`)
        .set({ Authorization: 'Basic ' + '98798374928' })
        .expect(401);
    });

    it('should delete blog by id', async () => {
      await request(app.getHttpServer())
        .delete(`/blogs/${newBlog[0]._id.toString()}`)
        .set({ Authorization: 'Basic ' + encodeAuth() })
        .expect(204);

      await request(app.getHttpServer()).get(`/blogs`).expect(200, {
        pagesCount: 0,
        page: 1,
        pageSize: 10,
        totalCount: 0,
        items: [],
      });
    });
  });
});
