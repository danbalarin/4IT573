import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PersistanceModule } from '../persistance/persistance.module';
import { PrismaService } from '../persistance/prisma/prisma.service';

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
      imports: [PersistanceModule],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find user by id', async () => {
    prisma.user.findUnique = jest
      .fn()
      .mockReturnValueOnce({ id: 1, email: 'test@example.com' });

    const user = await service.findUserById(1);
    expect(user).toBeDefined();
    expect(user.id).toEqual(1);
  });

  it('should not find user by id', async () => {
    prisma.user.findUnique = jest.fn().mockReturnValueOnce(undefined);

    const user = await service.findUserById(1);
    expect(user).not.toBeDefined();
  });

  it('should find user by email', async () => {
    prisma.user.findUnique = jest
      .fn()
      .mockReturnValueOnce({ id: 1, email: 'test@example.com' });

    const user = await service.findUserByEmail('test@example.com');
    expect(user).toBeDefined();
    expect(user.email).toEqual('test@example.com');
  });

  it('should not find user by email', async () => {
    prisma.user.findUnique = jest.fn().mockReturnValueOnce(undefined);

    const user = await service.findUserByEmail('test@example.com');
    expect(user).not.toBeDefined();
  });

  it('should create user', async () => {
    prisma.user.create = jest
      .fn()
      .mockReturnValueOnce({ id: 1, email: 'test@example.com' });

    const user = await service.createUser({ email: '', password: '' });
    expect(user).toBeDefined();
    expect(user.id).toEqual(1);
  });
});
