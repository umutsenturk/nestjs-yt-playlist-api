import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { FavDto } from './dto';
import { FavsService } from './favs.service';

@UseGuards(JwtGuard)
@Controller('favs')
export class FavsController {
  constructor(private favService: FavsService) {}

  @Post(':listId')
  createFav(
    @Param('listId', ParseIntPipe) listId: number,
    @Body() dto: FavDto,
  ) {
    return this.favService.createFav(listId, dto);
  }

  @Get(':listId')
  getFavs(@Param('listId', ParseIntPipe) listId: number) {
    return this.favService.getFavs(listId);
  }

  @Get(':listId/:id')
  getFavById(
    @Param('listId', ParseIntPipe) listId: number,
    @Param('id', ParseIntPipe) favId: number,
  ) {
    return this.favService.getFavById(listId, favId);
  }

  @Patch(':listId/:id')
  editFavById(
    @Param('listId', ParseIntPipe) listId: number,
    @Body() dto: FavDto,
    @Param('id', ParseIntPipe) favId: number,
  ) {
    return this.favService.editFavById(listId, favId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':listId/:id')
  deleteFavById(
    @Param('listId', ParseIntPipe) listId: number,
    @Param('id', ParseIntPipe) favId: number,
  ) {
    return this.favService.deleteFavById(listId, favId);
  }
}
