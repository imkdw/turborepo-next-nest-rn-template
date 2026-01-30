import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateUserDto } from '@/modules/user/dto/create-user.dto';
import { USER_NAME_MAX_LENGTH } from '@repo/consts';

describe('CreateUserDto', () => {
  const createDto = (data: Partial<CreateUserDto>) => {
    return plainToInstance(CreateUserDto, data);
  };

  describe('email', () => {
    it('should pass with valid email', async () => {
      const dto = createDto({ email: 'test@example.com', name: 'Test User' });
      const errors = await validate(dto);

      expect(errors.length).toBe(0);
    });

    it('should fail with invalid email format', async () => {
      const dto = createDto({ email: 'invalid-email', name: 'Test User' });
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0]?.property).toBe('email');
    });

    it('should fail with empty email', async () => {
      const dto = createDto({ email: '', name: 'Test User' });
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0]?.property).toBe('email');
    });
  });

  describe('name', () => {
    it('should pass with valid name', async () => {
      const dto = createDto({ email: 'test@example.com', name: 'Test User' });
      const errors = await validate(dto);

      expect(errors.length).toBe(0);
    });

    it('should fail with empty name', async () => {
      const dto = createDto({ email: 'test@example.com', name: '' });
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0]?.property).toBe('name');
    });

    it('should fail when name exceeds max length', async () => {
      const dto = createDto({
        email: 'test@example.com',
        name: 'a'.repeat(USER_NAME_MAX_LENGTH + 1),
      });
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0]?.property).toBe('name');
    });
  });
});
