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

  // @Post()
  // create(@Body() createProductoDto:CreateProductoDto): Promise<Producto> {
  //   return this.productsService.create(createProductoDto);
  // }
  //@Auth(Role.ADMIN)
  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  async create(
    @Body() createProductoDto: any,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<Producto> {
    console.log('files', files);
    const parsedProductDto: CreateProductoDto = JSON.parse(
      createProductoDto.data,
    );
    if (files) {
      const imagesUrl = await this.imageUploadService.uploadImages(files);
      parsedProductDto.imagenes = imagesUrl;
    }

    try {
      console.log('parsedproduct', parsedProductDto);

      const createdProduct = await this.productsService.create(
        parsedProductDto,
      );
      return createdProduct;
    } catch (error) {
      this.commonService.handleExceptions(error);
    }
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
  @UseInterceptors(FilesInterceptor('files'))
  async update(@Param('id') id: string, 
    @Body() updateProductoDto:any,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const parsedProductDto: UpdateProductoDto = JSON.parse(
      updateProductoDto.data);
    if (files) {
      const imagesUrl = await this.imageUploadService.uploadImages(files);
      parsedProductDto.imagenes = imagesUrl;
    }
    return this.productsService.update(id, parsedProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Producto> {
    return this.productsService.remove(id);
  }
}

