import { Test, TestingModule } from '@nestjs/testing';
import { SafeTextController } from './safe-text.controller';
import { JwtService } from '@nestjs/jwt';
import { SafeTextService } from './safe-text.service';
import { PrismaService } from '../persistance/prisma/prisma.service';

describe('SafeTextController', () => {
  let controller: SafeTextController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtService, SafeTextService, PrismaService],
      controllers: [SafeTextController],
    }).compile();

    controller = module.get<SafeTextController>(SafeTextController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
