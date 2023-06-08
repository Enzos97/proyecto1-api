import { Injectable } from '@nestjs/common';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { CreateSubcategoriaDto } from './dto/create-subcategoria.dto';
import { UpdateSubcategoriaDto } from './dto/update-subcategoria.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Subcategoria } from './entities/subcategoria.entity';
import { Categoria } from './entities/categoria.entity';
import { Model } from 'mongoose';

@Injectable()
export class SubcategoriasService {
  constructor(
    @InjectModel(Categoria.name) 
    private categoryModel: Model<Categoria>,
    @InjectModel(Subcategoria.name) 
    private subcategoryModel: Model<Subcategoria>,
  ){}
  async create(createSubcategoriaDto: CreateSubcategoriaDto) {
    const newSubcategory = await this.subcategoryModel.create(createSubcategoriaDto)
    if(createSubcategoriaDto.categoria){
      await this.categoryModel.findByIdAndUpdate(
        createSubcategoriaDto.categoria,
        { $push: { subcategorias: newSubcategory.id } },
        { new: true }
       );
    }
    if(createSubcategoriaDto.productos){
      await this.subcategoryModel.findByIdAndUpdate(
        newSubcategory.id,
        { $push: { subcategorias: { $each: createSubcategoriaDto.productos } } },
        { new: true }
      );
    } 
    return newSubcategory
  }

  findAll() {
    return `This action returns all categorias`;
  }

  findOne(id: number) {
    return `This action returns a #${id} categoria`;
  }

  update(id: number, updateSubcategoriaDto: UpdateSubcategoriaDto) {
    return `This action updates a #${id} categoria`;
  }

  remove(id: number) {
    return `This action removes a #${id} categoria`;
  }
}
