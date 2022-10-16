import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ListDto } from './dto';

@Injectable()
export class ListService {
  constructor(private prisma: PrismaService) {}
  async createList(userId: number, dto: ListDto) {
    const list = await this.prisma.list.create({
      data: {
        userId,
        ...dto,
      },
    });
    return list;
  }

  getLists(userId: number) {
    return this.prisma.list.findMany({
      where: {
        userId,
      },
    });
  }

  getListById(userId: number, listId: number) {
    return this.prisma.list.findFirst({
      where: {
        userId,
        id: listId,
      },
    });
  }

  async editListById(userId: number, listId: number, dto: ListDto) {
    const list = await this.prisma.list.findFirst({
      where: {
        id: listId,
      },
    });

    if (!list || list.userId !== userId) {
      throw new ForbiddenException('Access denied.');
    }
    return this.prisma.list.update({
      where: {
        id: listId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteListById(userId: number, listId: number) {
    const list = await this.prisma.list.findFirst({
      where: {
        id: listId,
      },
    });
    if (!list || list.userId !== userId) {
      throw new ForbiddenException('Access denied.');
    }

    await this.prisma.list.delete({
      where: {
        id: listId,
      },
    });
  }
}
