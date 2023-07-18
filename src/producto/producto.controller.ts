import { Controller, Get, Post, Put, Delete, Body, Param, Patch, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { ProductosService } from './producto.service';
import { Producto } from './entities/producto.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { CommonService } from '../common/common.service';
import { ImageUploadService } from '../image-upload/image-upload.service';
import { Auth } from 'src/user/role-protected/auth.decorator';
import { Role } from 'src/user/types/role.type';

@Controller('productos')
export class ProductosController {
  constructor(
    private readonly productsService: ProductosService,
    private readonly commonService: CommonService,
    private readonly imageUploadService: ImageUploadService
    ) {}

  @Post()
  async create(@Body() createProductoDto: CreateProductoDto): Promise<Producto> {
      return await this.productsService.create(createProductoDto);
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
  async update(@Param('id') id: string, @Body() updateProductoDto:UpdateProductoDto,) {
    return this.productsService.update(id, updateProductoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Producto> {
    return this.productsService.remove(id);
  }
}

