import { Injectable } from '@nestjs/common';
import { PrismaService } from '../persistance/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  findUserById(id: number) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  findUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  createUser(user: CreateUserDto) {
    return this.prisma.user.create({
      data: {
        ...user,
      },
    });
  }
}
