import { plainToInstance } from 'class-transformer';
import { CreateUserDto } from './create-user.dto';
import { validate } from 'class-validator';

describe('CreateUserDto', () => {
  it('should check password', async () => {
    const missingPassword = plainToInstance(CreateUserDto, {
      email: 'test@example.com',
    });

    let errors = await validate(missingPassword);
    expect(errors.length).toBe(1);
    expect(errors[0].constraints).toEqual({
      isNotEmpty: 'password should not be empty',
      isString: 'password must be a string',
    });

    const emptyPassword = plainToInstance(CreateUserDto, {
      email: 'test@example.com',
      password: '',
    });

    errors = await validate(emptyPassword);
    expect(errors.length).toBe(1);
    expect(errors[0].constraints).toEqual({
      isNotEmpty: 'password should not be empty',
    });
  });

  it('should check email', async () => {
    const invalidEmail = plainToInstance(CreateUserDto, {
      password: 'password',
    });

    const errors = await validate(invalidEmail);
    expect(errors.length).toBe(1);
    expect(errors[0].constraints).toEqual({
      isEmail: 'email must be an email',
    });
  });

  it('should check email and password', async () => {
    const validInput = plainToInstance(CreateUserDto, {
      email: 'test@example.com',
      password: 'password',
    });

    const errors = await validate(validInput);
    expect(errors.length).toBe(0);
  });
});
