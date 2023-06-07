import { NotFoundException } from '@nestjs/common';
import { SafeText } from '@prisma/client';

export const throwIfNotOwner = (userId: string | number, text?: SafeText) => {
  if (!text || text.userId !== +userId) {
    throw new NotFoundException();
  }
};
