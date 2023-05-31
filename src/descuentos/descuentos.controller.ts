import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { DescuentosService } from './descuentos.service';
import { CreateDescuentoDto } from './dto/create-descuento.dto';
import { Descuento } from './entities/descuento.model';

@Controller('descuentos')
export class DescuentosController {
  constructor(private readonly descuentosService: DescuentosService) {}

  @Post()
  create(@Body() createDescuentoDto: CreateDescuentoDto): Promise<Descuento> {
    return this.descuentosService.create(createDescuentoDto);
  }

  @Get()
  findAll(): Promise<Descuento[]> {
    return this.descuentosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Descuento> {
    return this.descuentosService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateDescuentoDto: CreateDescuentoDto): Promise<Descuento> {
    return this.descuentosService.update(id, updateDescuentoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Descuento> {
    return this.descuentosService.remove(id);
  }
}
