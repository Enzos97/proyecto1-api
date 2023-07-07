import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrdenesService } from './ordenes.service';
import { CreateOrdeneDto } from './dto/create-ordene.dto';
import { UpdateOrdeneDto } from './dto/update-ordene.dto';
import { AddOrUpdateProductDto } from './dto/addOrUpdateProduct.dto';

@Controller('ordenes')
export class OrdenesController {
  constructor(private readonly ordenesService: OrdenesService) {}

  @Post()
  create(@Body() createOrdeneDto: CreateOrdeneDto) {
    return this.ordenesService.create(createOrdeneDto);
  }

  @Get()
  findAll() {
    return this.ordenesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordenesService.findOne(id);
  }
  @Get('ultima/pendiente')
  findlastPending(){
    return this.ordenesService.findLastPending();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrdeneDto: UpdateOrdeneDto) {
    return this.ordenesService.update(id, updateOrdeneDto);
  }
  @Patch('carrito/stock')
  updateCarrito(@Body() addOrUpdateProductDto: AddOrUpdateProductDto) {
    return this.ordenesService.addOrUpdateProductOrStock(addOrUpdateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordenesService.remove(id);
  }
}
