import { Test, TestingModule } from '@nestjs/testing';
import { SafeTextService } from './safe-text.service';
import { PersistanceModule } from '../persistance/persistance.module';
import { PrismaService } from '../persistance/prisma/prisma.service';

describe('SafeTextService', () => {
  let service: SafeTextService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SafeTextService],
      imports: [PersistanceModule],
    }).compile();

    service = module.get<SafeTextService>(SafeTextService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find safeText by id', async () => {
    prisma.safeText.findUnique = jest
      .fn()
      .mockReturnValueOnce({ id: 1, text: 'text' });

    const safeText = await service.findOne(1);
    expect(safeText).toBeDefined();
    expect(safeText.id).toEqual(1);
  });

  it('should not find safeText by id', async () => {
    prisma.safeText.findUnique = jest.fn().mockReturnValueOnce(undefined);

    const safeText = await service.findOne(1);
    expect(safeText).not.toBeDefined();
  });

  it('should create safeText', async () => {
    prisma.safeText.create = jest
      .fn()
      .mockReturnValueOnce({ id: 1, text: 'text' });

    const safeText = await service.create(0, { text: 'text' });
    expect(safeText).toBeDefined();
    expect(safeText.id).toEqual(1);
  });
});
