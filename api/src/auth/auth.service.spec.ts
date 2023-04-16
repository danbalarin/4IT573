import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PersistanceModule } from '../persistance/persistance.module';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, ConfigService, UserService],
      imports: [
        PersistanceModule,
        JwtModule.register({ secretOrPrivateKey: 'secret' }),
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should login and return a token', async () => {
    // @ts-expect-error - Mocking a private method
    service.comparePassword = jest.fn().mockImplementation((a, b) => a === b);
    userService.findUserByEmail = jest.fn().mockResolvedValue({
      id: 1,
      email: 'test@example.com',
      password: 'password',
    });

    const token = await service.login({
      email: 'test@example.com',
      password: 'password',
    });

    expect(token).toBeDefined();

    const payload = jwtService.verify(token);
    expect(payload.email).toBe('test@example.com');
    expect(payload.sub).toBe(1);
    expect(payload.iat).toBeDefined();
  });

  it('should throw an error if the user does not exist', async () => {
    userService.findUserByEmail = jest.fn().mockResolvedValue(undefined);

    const token = service.login({
      email: 'test@example.com',
      password: 'password',
    });

    await expect(token).rejects.toThrowError(BadRequestException);
  });

  it('should throw an error if the passwords doesnt match', async () => {
    // @ts-expect-error - Mocking a private method
    service.comparePassword = jest.fn().mockImplementation((a, b) => a === b);

    userService.findUserByEmail = jest.fn().mockResolvedValue({
      email: 'test@example.com',
      password: 'password1',
    });

    const token = service.login({
      email: 'test@example.com',
      password: 'password2',
    });

    await expect(token).rejects.toThrowError(UnauthorizedException);
  });

  it('should signup and return a user', async () => {
    // @ts-expect-error - Mocking a private method
    service.hashPassword = jest.fn().mockImplementation((a) => a);

    userService.createUser = jest.fn().mockResolvedValue({
      id: 1,
      email: 'test@example.com',
      password: 'password',
    });

    const user = await service.signup({
      email: 'test@example.com',
      password: 'password',
    });

    expect(user).toBeDefined();
    expect(user.id).toBe(1);
    expect(user.email).toBe('test@example.com');
    // @ts-expect-error - Testing for password leak
    expect(user.password).not.toBeDefined();
  });
});
