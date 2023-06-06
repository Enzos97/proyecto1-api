import { Controller, Get, Post, Put, Delete, Body, Param, Patch } from '@nestjs/common';
import { ProductosService } from './producto.service';
import { Producto } from './entities/producto.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productsService: ProductosService) {}

  @Post()
  create(@Body() createProductoDto:CreateProductoDto): Promise<Producto> {
    return this.productsService.create(createProductoDto);
  }

  @Get()
  findAll(): Promise<Producto[]> {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Producto> {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductoDto:UpdateProductoDto): Promise<Producto> {
    return this.productsService.update(id, updateProductoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Producto> {
    return this.productsService.remove(id);
  }
}

