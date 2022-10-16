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
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { ListDto } from './dto';
import { ListService } from './list.service';

@UseGuards(JwtGuard)
@Controller('list')
export class ListController {
  constructor(private listService: ListService) {}

  @Post()
  createList(@GetUser('id') userId: number, @Body() dto: ListDto) {
    return this.listService.createList(userId, dto);
  }

  @Get()
  getLists(@GetUser('id') userId: number) {
    return this.listService.getLists(userId);
  }

  @Get(':id')
  getListById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) listId: number,
  ) {
    return this.listService.getListById(userId, listId);
  }

  @Patch(':id')
  editListById(
    @GetUser('id') userId: number,
    @Body() dto: ListDto,
    @Param('id', ParseIntPipe) listId: number,
  ) {
    return this.listService.editListById(userId, listId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteListById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) listId: number,
  ) {
    return this.listService.deleteListById(userId, listId);
  }
}
