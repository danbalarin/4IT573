import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { PersistanceModule } from '../persistance/persistance.module';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { LoginDto } from './dto/login.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, ConfigService, UserService, JwtService],
      controllers: [AuthController],
      imports: [PersistanceModule],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should login and return a token', async () => {
      const cookieFn = jest.fn();
      service.login = jest.fn().mockResolvedValue('token');

      const token = await controller.login(
        {
          email: 'test@example.com',
          password: 'password',
        },
        { cookie: cookieFn } as any,
      );

      expect(token).toBe('token');
      expect(cookieFn).toBeCalledWith('Authorization', 'Bearer token', {
        httpOnly: true,
      });
    });

    it('should not login with incorrect values', async () => {
      const cookieFn = jest.fn();
      userService.findUserByEmail = jest.fn().mockResolvedValue(undefined);

      const token = controller.login(
        {
          email: 'test@example.com',
          password: 'password',
        },
        { cookie: cookieFn } as any,
      );

      await expect(token).rejects.toThrowError();
      expect(cookieFn).not.toBeCalled();
    });

    describe('login input validation', () => {
      it('should check password', async () => {
        const missingPassword = plainToInstance(LoginDto, {
          email: 'test@example.com',
        });

        let errors = await validate(missingPassword);
        expect(errors.length).toBe(1);
        expect(errors[0].constraints).toEqual({
          isNotEmpty: 'password should not be empty',
          isString: 'password must be a string',
        });

        const emptyPassword = plainToInstance(LoginDto, {
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
        const invalidEmail = plainToInstance(LoginDto, {
          email: 'invalid',
          password: 'password',
        });

        const errors = await validate(invalidEmail);
        expect(errors.length).toBe(1);
        expect(errors[0].constraints).toEqual({
          isEmail: 'email must be an email',
        });
      });

      it('should check email and password', async () => {
        const validInput = plainToInstance(LoginDto, {
          email: 'test@example.com',
          password: 'password',
        });

        const errors = await validate(validInput);
        expect(errors.length).toBe(0);
      });
    });
  });

  describe('signup', () => {
    it('should signup and return user', async () => {
      const cookieFn = jest.fn();
      const input = {
        email: 'test@example.com',
        password: 'Password1',
      };
      userService.createUser = jest.fn().mockResolvedValue({ ...input, id: 1 });
      service.getJwtPayload = jest.fn().mockResolvedValue('token');

      const user = await controller.signup(input, { cookie: cookieFn } as any);

      expect(user.id).toBe(1);
      expect(user.email).toBe(input.email);
      // @ts-expect-error - Testing for password leak
      expect(user.password).toBeUndefined();

      expect(cookieFn).toBeCalledWith('Authorization', 'Bearer token', {
        httpOnly: true,
      });
    });

    // Signup input validation cannot be tested due to DI problems with custom validation decorators
  });
});
