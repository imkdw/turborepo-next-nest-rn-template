import request from 'supertest';
import { app } from './setup';
import { ExceptionResponse } from '@repo/types';
import { EXCEPTION_CODES } from '@repo/exception';
import { USER_NAME_MAX_LENGTH } from '@repo/consts';
import { HttpStatus } from '@nestjs/common';

describe('E2E Tests', () => {
  describe('GET /v1 (Health Check)', () => {
    it('should respond with { data: "OK" }', async () => {
      const response = await request(app.getHttpServer()).get('/v1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ data: 'OK' });
    });
  });

  describe('GET /v1/users', () => {
    it('should respond with { data: [...] }', async () => {
      const response = await request(app.getHttpServer()).get('/v1/users');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ data: expect.any(Array) });
    });
  });

  describe('GET /v1/users/:id (Not Found)', () => {
    it('should respond with ExceptionResponse when CustomException is thrown', async () => {
      const response = await request(app.getHttpServer()).get('/v1/users/non-existent-id');

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
      expect(response.body).toMatchObject({
        statusCode: HttpStatus.NOT_FOUND,
        errorCode: EXCEPTION_CODES.USER_NOT_FOUND,
        path: expect.stringContaining('/v1/users/'),
      } satisfies ExceptionResponse);
      expect(response.body.data).toBeUndefined();
      expect(response.body.message).toBeUndefined();
    });
  });

  describe('POST /v1/users', () => {
    it('should create a user with valid data', async () => {
      const response = await request(app.getHttpServer()).post('/v1/users').send({
        email: 'test@example.com',
        name: 'Test User',
      });

      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body.data).toMatchObject({
        id: expect.any(String),
        email: 'test@example.com',
        name: 'Test User',
      });
    });

    it('should return 400 when email is invalid', async () => {
      const response = await request(app.getHttpServer()).post('/v1/users').send({
        email: 'invalid-email',
        name: 'Test User',
      });

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should return 400 when name is empty', async () => {
      const response = await request(app.getHttpServer()).post('/v1/users').send({
        email: 'test@example.com',
        name: '',
      });

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should return 400 when name exceeds max length', async () => {
      const response = await request(app.getHttpServer())
        .post('/v1/users')
        .send({
          email: 'test@example.com',
          name: 'a'.repeat(USER_NAME_MAX_LENGTH + 1),
        });

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });
  });
});
