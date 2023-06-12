import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles  } from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { SubcategoriasService } from './subcategorias.service';
import { CreateSubcategoriaDto } from './dto/create-subcategoria.dto';
import { AddSubcategoriaDto } from './dto/addSubcategoria.dto';
import { MongoIdPipe } from 'src/common/pipes/mongo-id.pipe';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ImageUploadService } from 'src/image-upload/image-upload.service';
import { UpdateSubcategoriaDto } from './dto/update-subcategoria.dto';

@Controller('categorias')
export class CategoriasController {
  constructor(
    private readonly categoriasService: CategoriasService,
    private readonly subcategoriasService: SubcategoriasService,
    private readonly imageUploadService: ImageUploadService
    ) {}

   @Post()
   @UseInterceptors(FilesInterceptor('files'))
   async create(
    @Body() createCategoriaDto: any,
    @UploadedFiles() files: Array<Express.Multer.File>,
    ) {
    const parsedCategoriaDto: CreateCategoriaDto = JSON.parse(
      createCategoriaDto.data,
    );
    if (files) {
      const imagesUrl = await this.imageUploadService.uploadImages(files);
      parsedCategoriaDto.imagen = imagesUrl;
    }
    return this.categoriasService.create(parsedCategoriaDto);
  }

  @Post('addSubcategoria')
  AddSubCategoria(@Body() addSubcategoriaDto: AddSubcategoriaDto) {
    return this.categoriasService.addSubcategory(addSubcategoriaDto);
  }
  @Post('subcategoria')
  @UseInterceptors(FilesInterceptor('files'))
  async createSubcategoria(
    @Body() createSubcategoriaDto: any,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const parsedCategoriaDto: CreateSubcategoriaDto = JSON.parse(
      createSubcategoriaDto.data,
    );
    if (files) {
      const imagesUrl = await this.imageUploadService.uploadImages(files);
      parsedCategoriaDto.imagen = imagesUrl;
    }
    return this.subcategoriasService.create(parsedCategoriaDto);
  }
  @Delete('removeSubcategory')
  async removeSubcategory(@Body() removeSubcategoriadto:AddSubcategoriaDto){
    return this.categoriasService.removeSubcategory(removeSubcategoriadto);
  }
  @Get()
  findAll() {
    return this.categoriasService.findAll();
  }
  @Get('sub/subcategoria')
  findAllSubCat() {
    return this.subcategoriasService.findAll();
  }
  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.categoriasService.findOne(term);
  }

  @Get('sub/subcategoria/:id')
  findOneSub(@Param('term') term: string) {
    return this.subcategoriasService.findOne(term);
  }
  //solo puede actualizar imagen y subcategoria
  @Patch(':id')
  @UseInterceptors(FilesInterceptor('files'))
  async update(
    @Param('id') id: string, @Body() updateCategoriaDto: any,
    @UploadedFiles() files: Array<Express.Multer.File>
  ) {
    const parsedProductDto: UpdateCategoriaDto = JSON.parse(
      updateCategoriaDto.data,
    );
      if(files){
        const imagesUrl = await this.imageUploadService.uploadImages(files);
        parsedProductDto.imagen=imagesUrl
      }
      return this.categoriasService.update(id, parsedProductDto); 
    }
  @Patch('sub/subcategoria:id')
  @UseInterceptors(FilesInterceptor('files'))
  async updateSub(
    @Param('id') id: string, @Body() updateSubcategoriaDto: any,
    @UploadedFiles() files: Array<Express.Multer.File>
  ) {
    const parsedProductDto: UpdateSubcategoriaDto = JSON.parse(
      updateSubcategoriaDto.data,
    );
      if(files){
        const imagesUrl = await this.imageUploadService.uploadImages(files);
        parsedProductDto.imagen=imagesUrl
      }
      return this.subcategoriasService.update(id, parsedProductDto); 
    }

  @Delete(':id')
  remove(@Param('id',MongoIdPipe) id: string) {
    return this.categoriasService.remove(id);
  }

  @Delete('sub/Subcategoria/:id')
  removeSub(@Param('id',MongoIdPipe) id: string) {
    return this.subcategoriasService.remove(id);
  }
}
