import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { RedisService } from '../src/libs/redis/redis.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule
  beforeAll(async () => {
     
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    await app.init();
  });

  const username = 'narayan'

  let jwtToken: string

  it('/auth/signup (POST) (Success Signup)', () => {
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ username, password: 'Secret.123' })
      .expect(201)
  });

  it('/auth/signin (POST) (Success Signin)', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ username, password: 'Secret.123' })
      .expect(201)
    
    jwtToken = response.body.accessToken

    expect(jwtToken).toMatch(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/)
  });

  it('/auth/signin (POST)  (Invalid Credentials)', () => {
    return request(app.getHttpServer())
      .post('/auth/signin')
      .send({ username: 'narayan', password: 'Secret.1234' })
      .expect(401)
  });

  it('/countries/seed (POST)  (Seed DB)', () => {
    return request(app.getHttpServer())
      .post('/countries/seed')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(201)
  });

  it('/countries (POST)  (Add Country)', async () => {
    return request(app.getHttpServer())
      .post('/countries')
      .send({ name: 'Test Country', code: 'tst', population: 999999 })
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(201)
  });

  it('/countries (PATCH)  (Update Country Population)', async () => {
    return request(app.getHttpServer())
      .patch('/countries')
      .send({ name: 'Test Country', code: 'tst', population: 9999999999 })
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200)
  });

  it('/countries (GET)  (Sort and List Countries)', async () => {
    const response = await request(app.getHttpServer())
      .get('/countries')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200)
    
      expect(response.body[0].code).toMatch('tst')
  });

  it('/countries (DELETE)  (Delete Country)', async () => {
    return request(app.getHttpServer())
      .delete('/countries/tst')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200)
  });

  afterAll(async () => {
    let redisService = moduleFixture.get<RedisService>(RedisService);
    await redisService.deleteValue(`username_${username}`)
    await app.close();
  });
});
