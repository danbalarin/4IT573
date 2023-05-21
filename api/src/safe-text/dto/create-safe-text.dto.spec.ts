import { plainToInstance } from 'class-transformer';
import { CreateSafeTextDto } from './create-safe-text.dto';
import { validate } from 'class-validator';

describe('CreateSafeTextDto', () => {
  it('should check text', async () => {
    const missingText = plainToInstance(CreateSafeTextDto, {
      userId: 1,
    });

    let errors = await validate(missingText);
    expect(errors.length).toBe(1);
    expect(errors[0].constraints).toEqual({
      isNotEmpty: 'text should not be empty',
      isString: 'text must be a string',
    });

    const emptyText = plainToInstance(CreateSafeTextDto, {
      userId: 1,
      text: '',
    });

    errors = await validate(emptyText);
    expect(errors.length).toBe(1);
    expect(errors[0].constraints).toEqual({
      isNotEmpty: 'text should not be empty',
    });
  });

  it('should check domain', async () => {
    const missingDomain = plainToInstance(CreateSafeTextDto, {
      text: 'text',
      userId: 1,
    });

    let errors = await validate(missingDomain);
    expect(errors.length).toBe(0);

    const invalidDomain = plainToInstance(CreateSafeTextDto, {
      text: 'text',
      userId: 1,
      domain: 123,
    });

    errors = await validate(invalidDomain);
    expect(errors.length).toBe(1);
    expect(errors[0].constraints).toEqual({
      isString: 'domain must be a string',
    });
  });

  it('should check text, userId and domain', async () => {
    const validInput = plainToInstance(CreateSafeTextDto, {
      text: 'secure note',
      userId: 1,
      domain: 'example.com',
    });

    const errors = await validate(validInput);
    expect(errors.length).toBe(0);
  });
});
