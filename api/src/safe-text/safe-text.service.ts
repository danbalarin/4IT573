import { Injectable } from '@nestjs/common';
import { PrismaService } from '../persistance/prisma/prisma.service';
import { CreateSafeTextDto } from './dto/create-safe-text.dto';
import { UpdateSafeTextDto } from './dto/update-safe-text.dto';

@Injectable()
export class SafeTextService {
  constructor(private readonly prisma: PrismaService) {}

  findOne(id: number) {
    return this.prisma.safeText.findUnique({
      where: {
        id,
      },
    });
  }

  findManyByUserId(userId: number) {
    return this.prisma.safeText.findMany({
      where: {
        userId,
      },
    });
  }

  create(userId, safeText: CreateSafeTextDto) {
    return this.prisma.safeText.create({
      data: {
        ...safeText,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  update(id: number, safeText: UpdateSafeTextDto) {
    return this.prisma.safeText.update({
      where: {
        id,
      },
      data: {
        ...safeText,
      },
    });
  }

  delete(id: number) {
    return this.prisma.safeText.delete({
      where: {
        id,
      },
    });
  }
}
