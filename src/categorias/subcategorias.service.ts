import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { CreateSubcategoriaDto } from './dto/create-subcategoria.dto';
import { UpdateSubcategoriaDto } from './dto/update-subcategoria.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Subcategoria } from './entities/subcategoria.entity';
import { Categoria } from './entities/categoria.entity';
import { Model, Types } from 'mongoose';
import { AddProductDto } from './dto/addProduct.dto';
import { CommonService } from 'src/common/common.service';

@Injectable()
export class SubcategoriasService {
  constructor(
    @InjectModel(Categoria.name) 
    private categoryModel: Model<Categoria>,
    @InjectModel(Subcategoria.name) 
    private subcategoryModel: Model<Subcategoria>,
    private commonService: CommonService,
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

  async findAll() {
    try {
      return await this.subcategoryModel.find().populate('productos').exec();
    } catch (error) {
      this.commonService.handleExceptions(error)
    }
  }

  async findOne(idONombre: string) {
    try {
      let query = this.categoryModel.findOne();
  
      if (Types.ObjectId.isValid(idONombre)) {
        // Buscar por ID
        query.where('_id').equals(idONombre);
      } else {
        // Buscar por nombre (case sensitive)
        // const regex = new RegExp(`^${idONombre}$`, 'i');
        // query.where('nombre', regex);
        const categoriaInDb = await this.subcategoryModel.find( {"nombre":
        { $regex: new RegExp("^" + idONombre, "i") } })
        if(!categoriaInDb.length){
          throw new NotFoundException(`No existe categoría con el ID o nombre: ${idONombre}`);
        }
        return categoriaInDb[0]
      }
  
      query.populate('subcategorias');
  
      const categoria = await query.exec();
      if (!categoria) {
        throw new NotFoundException(`No existe categoría con el ID o nombre: ${idONombre}`);
      }
  
      return categoria;
    } catch (error) {
      this.commonService.handleExceptions(error);
    }
  }

  async update(id: string, updateSubcategoriaDto: UpdateSubcategoriaDto) {
    try {
      return await this.subcategoryModel.findByIdAndUpdate(id, updateSubcategoriaDto, {
        new: true,
      });
    } catch (error) {
      this.commonService.handleExceptions(error)
    }
  }

  async remove(id: string) {
    try {
      return await this.subcategoryModel.findByIdAndRemove(id);
    } catch (error) {
      this.commonService.handleExceptions(error)
    }
  }
  async addProduct(addProductDto:AddProductDto){
    return this.subcategoryModel.findByIdAndUpdate(
      addProductDto.subcategoriaId,
      { $push: { productos: addProductDto.productoId } },
      { new: true },
    );
  }

  async removeProduct(addProductDto:AddProductDto){
    return this.subcategoryModel.findByIdAndUpdate(
      addProductDto.subcategoriaId,
      { $pull: { productos: addProductDto.productoId } },
      { new: true },
    );
  }
}
