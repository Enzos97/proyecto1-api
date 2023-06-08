import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { SubcategoriasService } from './subcategorias.service';
import { InjectModel } from '@nestjs/mongoose';
import { CommonService } from 'src/common/common.service';
import { Categoria } from './entities/categoria.entity';
import { Model } from 'mongoose';
import { Subcategoria } from './entities/subcategoria.entity';
import { AddSubcategoriaDto } from './dto/addSubcategoria.dto';
import { CreateSubcategoriaDto } from './dto/create-subcategoria.dto';
import { Types } from 'mongoose';
import { ObjectId } from 'bson';
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
    console.log(createCategoriaDto)
    const newCategory = new this.categoryModel({nombre:createCategoriaDto.nombre})
    await newCategory.save()
    if(createCategoriaDto.subcategorias){
      console.log('if',createCategoriaDto)
    const subcategoriasCreadas = await Promise.all(createCategoriaDto.subcategorias.map(async (nombre) => {
      const subcategoria = new this.subcategoryModel({ nombre, categoria: newCategory._id });
      return await subcategoria.save();
    }));
    const subcategoriasIds = subcategoriasCreadas.map(subcategoria => subcategoria._id);
    console.log(subcategoriasIds)
    console.log('newcatid',newCategory.id)
    const prueba = await this.categoryModel.findByIdAndUpdate(
      newCategory.id,
      { $push: { subcategorias: { $each: subcategoriasIds } } },
      { new: false }
     );
     console.log(prueba)
    }
    await newCategory.save()

    return newCategory;
  }

  async addSubcategory(addSubcategoriaDto: AddSubcategoriaDto) {
    try {
      this.isInSubcategorias(addSubcategoriaDto)
      const addSubCat = await this.categoryModel.findByIdAndUpdate(
        addSubcategoriaDto.categoriaId,
        { $push: { subcategorias: addSubcategoriaDto.subcategoriaId } },
        { new: true },
      );
      return addSubCat
    } catch (error) {
      this.commonService.handleExceptions(error)
    }
  }

  async removeSubcategory(removeSubcategoriadto:AddSubcategoriaDto){
    try {
      const removeSubcategory = await this.categoryModel.findByIdAndUpdate(
        removeSubcategoriadto.categoriaId,
        { $pull: { subcategorias: removeSubcategoriadto.subcategoriaId } },
        { new: true },
      );
      return removeSubcategory
    } catch (error) {
      throw new this.commonService.handleExceptions(error)
    }
  }
  async findAll() {
    try {
      return await this.categoryModel.find().populate('subcategorias').exec();
    } catch (error) {
      this.commonService.handleExceptions(error)
    }
  }

  // async findOne(id: string) {
  //   try {
  //     const categoria = await this.categoryModel.findById(id).populate('subcategorias').exec();
  //     if(!categoria){
  //       this.commonService.handleExceptions(new NotFoundException(`no existe categoria con id: ${id}`))
  //     }
  //     return categoria
  //   } catch (error) {
  //     this.commonService.handleExceptions(error)
  //   }
  // }
  

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
        const categoriaInDb = await this.categoryModel.find( {"nombre":
        { $regex: new RegExp("^" + idONombre.toLowerCase(), "i") } })
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
  async update(id: string, updateCategoriaDto: UpdateCategoriaDto) {
    try {
      return await this.categoryModel.findByIdAndUpdate(id, updateCategoriaDto, {
        new: true,
      });
    } catch (error) {
      this.commonService.handleExceptions(error)
    }
  }

  async remove(id: string) {
    try {
      return await this.categoryModel.findByIdAndRemove(id);
    } catch (error) {
      this.commonService.handleExceptions(error)
    }
  }

  //helper
  async isInSubcategorias(addSubcategoriaDto: AddSubcategoriaDto){
    const findCategoria = await this.findOne(addSubcategoriaDto.categoriaId)
    const subEnCat = findCategoria.subcategorias.find(f=>f.id.toString()==addSubcategoriaDto.subcategoriaId)
    if(subEnCat){
      this.commonService.handleExceptions(new BadRequestException('ya has añadido esta subcategoria.'))
    }
  }
}
