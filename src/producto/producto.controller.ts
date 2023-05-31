import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ProductosService } from './producto.service';
import { Producto } from './entities/producto.model';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productsService: ProductosService) {}

  @Post()
  async create(@Body() product: Producto): Promise<Producto> {
    console.log(product)
    return this.productsService.create(product);
  }

  @Get()
  async findAll(): Promise<Producto[]> {
    return this.productsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Producto> {
    return this.productsService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() product: Producto): Promise<Producto> {
    return this.productsService.update(id, product);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Producto> {
    return this.productsService.remove(id);
  }
}

