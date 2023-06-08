import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { SubcategoriasService } from './subcategorias.service';
import { CreateSubcategoriaDto } from './dto/create-subcategoria.dto';
import { AddSubcategoriaDto } from './dto/addSubcategoria.dto';
import { MongoIdPipe } from 'src/common/pipes/mongo-id.pipe';

@Controller('categorias')
export class CategoriasController {
  constructor(
    private readonly categoriasService: CategoriasService,
    private readonly subcategoriasService: SubcategoriasService
    ) {}

  @Post()
  create(@Body() createCategoriaDto: CreateCategoriaDto) {
    return this.categoriasService.create(createCategoriaDto);
  }
  @Post('addSubcategoria')
  AddSubCategoria(@Body() addSubcategoriaDto: AddSubcategoriaDto) {
    return this.categoriasService.addSubcategory(addSubcategoriaDto);
  }
  @Post('subcategoria')
  createSubcategoria(@Body() createSubcategoriaDto: CreateSubcategoriaDto) {
    return this.subcategoriasService.create(createSubcategoriaDto);
  }
  @Delete('removeSubcategory')
  async removeSubcategory(@Body() removeSubcategoriadto:AddSubcategoriaDto){
    return this.categoriasService.removeSubcategory(removeSubcategoriadto);
  }
  @Get()
  findAll() {
    return this.categoriasService.findAll();
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.categoriasService.findOne(term);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoriaDto: UpdateCategoriaDto) {
    return this.categoriasService.update(id, updateCategoriaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriasService.remove(id);
  }
}
