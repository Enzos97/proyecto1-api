import { Injectable } from '@nestjs/common';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { SubcategoriasService } from './subcategorias.service';
import { InjectModel } from '@nestjs/mongoose';
import { CommonService } from 'src/common/common.service';
import { Categoria } from './entities/categoria.entity';
import { Model } from 'mongoose';
import { Subcategoria } from './entities/subcategoria.entity';

@Injectable()
export class CategoriasService {
  constructor(
    private readonly subcategoriasService:SubcategoriasService,
    @InjectModel(Categoria.name) 
    private categoryModel: Model<Categoria>,
    @InjectModel(Subcategoria.name) 
    private subcategoryModel: Model<Subcategoria>,
    private commonService: CommonService,
  ){}
  async create(createCategoriaDto: CreateCategoriaDto) {
    const newCategory = await this.categoryModel.create(createCategoriaDto)
    if(createCategoriaDto.subcategorias){
      this.categoryModel.findByIdAndUpdate(
        newCategory.id,
        { $push: { subcategorias: { $each: createCategoriaDto.subcategorias } } },
        { new: true }
      );
    }

    return newCategory;
  }

  async addSubcategory(
    categoryId: string,
    subcategoryId: string,
  ): Promise<Categoria> {
    return this.categoryModel.findByIdAndUpdate(
      categoryId,
      { $push: { subcategorias: subcategoryId } },
      { new: true },
    );
  }
  findAll() {
    return `This action returns all categorias`;
  }

  findOne(id: number) {
    return `This action returns a #${id} categoria`;
  }

  update(id: number, updateCategoriaDto: UpdateCategoriaDto) {
    return `This action updates a #${id} categoria`;
  }

  remove(id: number) {
    return `This action removes a #${id} categoria`;
  }
}
