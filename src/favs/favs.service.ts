import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FavDto } from './dto';

@Injectable()
export class FavsService {
  constructor(private prisma: PrismaService) {}
  async createFav(listId: number, dto: FavDto) {
    const fav = await this.prisma.fav.create({
      data: {
        listId,
        ...dto,
      },
    });

    return fav;
  }

  getFavs(listId: number) {
    return this.prisma.fav.findMany({
      where: {
        listId,
      },
    });
  }

  getFavById(listId: number, favId: number) {
    return this.prisma.fav.findFirst({
      where: {
        listId,
        id: favId,
      },
    });
  }

  async editFavById(listId: number, favId: number, dto: FavDto) {
    const fav = await this.prisma.fav.findFirst({
      where: {
        id: favId,
      },
    });

    if (!fav || fav.listId !== listId) {
      throw new ForbiddenException('Access denied.');
    }
    return this.prisma.fav.update({
      where: {
        id: favId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteFavById(listId: number, favId: number) {
    const fav = await this.prisma.fav.findFirst({
      where: {
        id: favId,
      },
    });
    if (!fav || fav.listId !== listId) {
      throw new ForbiddenException('Access denied.');
    }

    await this.prisma.fav.delete({
      where: {
        id: favId,
      },
    });
  }
}
