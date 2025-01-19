import { INestApplication } from '@nestjs/common';
import request from 'supertest';

export const deleteAllData = async (app: INestApplication) => {
  const res = await request(app.getHttpServer()).delete(`/testing/all-data`);
  console.log('deleting all data', res.statusCode);
};
