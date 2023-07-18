import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { SubcategoriasService } from './subcategorias.service';
import { InjectModel } from '@nestjs/mongoose';
import { CommonService } from 'src/common/common.service';
import { Categoria } from './entities/categoria.entity';
import { Model, isValidObjectId } from 'mongoose';
import { Subcategoria } from './entities/subcategoria.entity';
import { AddSubcategoriaDto } from './dto/addSubcategoria.dto';
import { CreateSubcategoriaDto } from './dto/create-subcategoria.dto';
import { Types } from 'mongoose';
import { ObjectId } from 'bson';
import { AddProductDto } from './dto/addProduct.dto';
import { UploadImageService } from 'src/upload-image/upload-image.service';
@Injectable()
export class CategoriasService {
  constructor(
    private readonly subcategoriasService:SubcategoriasService,
    @InjectModel(Categoria.name) 
    private categoryModel: Model<Categoria>,
    @InjectModel(Subcategoria.name) 
    private subcategoryModel: Model<Subcategoria>,
    private commonService: CommonService,
    private uploadImageService:UploadImageService
  ){}
  // async create(createCategoriaDto: CreateCategoriaDto) {
  //   console.log(createCategoriaDto)
  //   const newCategory = new this.categoryModel({nombre:createCategoriaDto.nombre,imagen:createCategoriaDto.imagen})
  //   await newCategory.save()
  //   if(createCategoriaDto.subcategorias){
  //     console.log('if',createCategoriaDto)
  //   const subcategoriasCreadas = await Promise.all(createCategoriaDto.subcategorias.map(async (nombre) => {
  //     const subcategoria = new this.subcategoryModel({ nombre, categoria: newCategory._id });
  //     return await subcategoria.save();
  //   }));
  //   const subcategoriasIds = subcategoriasCreadas.map(subcategoria => subcategoria._id);
  //   console.log(subcategoriasIds)
  //   console.log('newcatid',newCategory.id)
  //   const prueba = await this.categoryModel.findByIdAndUpdate(
  //     newCategory.id,
  //     { $push: { subcategorias: { $each: subcategoriasIds } } },
  //     { new: false }
  //    );
  //    console.log(prueba)
  //   }
  //   await newCategory.save()

  //   return newCategory;
  // }
  async create(createCategoriaDto: CreateCategoriaDto) {
    console.log(createCategoriaDto)
    if(createCategoriaDto.imagen){
      const uploadImages = await this.uploadImageService.uploadFile(createCategoriaDto.nombre,createCategoriaDto.imagen)
      createCategoriaDto.imagen=uploadImages.imageUrl
    }
    const newCategory = new this.categoryModel({nombre:createCategoriaDto.nombre,imagen:createCategoriaDto.imagen})
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
      await this.isInSubcategorias(addSubcategoriaDto)
      const addSubCat = await this.categoryModel.findByIdAndUpdate(
        addSubcategoriaDto.categoriaId,
        { $push: { subcategorias: addSubcategoriaDto.subcategoriaId} },
        { new: true },
      );
      await this.subcategoryModel.findByIdAndUpdate(addSubcategoriaDto.subcategoriaId,{categoria:addSubcategoriaDto.categoriaId})
      return addSubCat
    } catch (error) {
      this.commonService.handleExceptions(error)
    }
  }
  async addProduct(addProductDto:AddProductDto){
    return this.categoryModel.findByIdAndUpdate(
      addProductDto.subcategoriaId,
      { $push: { productos: addProductDto.productoId } },
      { new: true },
    );
  }

  async removeProduct(addProductDto:AddProductDto){
    return this.categoryModel.findByIdAndUpdate(
      addProductDto.subcategoriaId,
      { $pull: { productos: addProductDto.productoId } },
      { new: true },
    );
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

  async findOne(idONombre: string) {
    try {
      let query = this.categoryModel.findOne();
    console.log('idONombre0',idONombre,isValidObjectId(idONombre))
      if (isValidObjectId(idONombre)) {
        query.where('_id').equals(idONombre);
      } else {
        console.log('idONombre1',idONombre)
        const regex = new RegExp("^" + idONombre, "i");
        query.where('nombre', regex);
      }
  
      query.populate('subcategorias');
  
      // const categoria = await query.exec();
      if (!query) {
        throw new NotFoundException(`No existe categoría con el ID o nombre: ${idONombre}`);
      }
  
      return query;
    } catch (error) {
      this.commonService.handleExceptions(error);
    }
  }

  async findByName(name:string){
    try {
      console.log('name',name)
      let query = this.categoryModel.findOne()
      const regex = new RegExp("^" + name, "i");
      query.where('nombre', regex);
      if (!query) {
        throw new NotFoundException(`No existe categoría con el nombre: ${name}`);
      }
      return query
    } catch (error) {
      this.commonService.handleExceptions(error);
    }
  }
  
  async update(id: string, updateCategoriaDto: UpdateCategoriaDto) {
    try {
      const updateCategoria = await this.categoryModel.findById(id)
      // if(updateCategoriaDto.imagen){
      //   const uploadImages = await this.uploadImageService.uploadFiles(updateCategoriaDto.nombre,updateCategoriaDto.imagen)
      //   updateCategoria.imagen=[...updateCategoria.imagen,...uploadImages.imageUrls]
      // }

      updateCategoria.nombre = updateCategoriaDto.nombre || updateCategoria.nombre 
      updateCategoria.descripcion = updateCategoriaDto.descripcion || updateCategoria.descripcion

      await updateCategoria.save()

      return updateCategoria
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

  /////////////////////////helper///////////////////////////

  async isInSubcategorias(addSubcategoriaDto: AddSubcategoriaDto): Promise<boolean> {
    const categoria = await this.categoryModel.findById(addSubcategoriaDto.categoriaId).exec();
  
    if (!categoria) {
      let error =  new NotFoundException(`No se encontró la categoría con ID: ${addSubcategoriaDto.categoriaId}`);
      this.commonService.handleExceptions(error)
    }
  
    const subcategoriaExists = categoria.subcategorias.some(subcategoriaId =>
      subcategoriaId.equals(addSubcategoriaDto.subcategoriaId)
    );
  
    if (subcategoriaExists) {
      let error = new BadRequestException('Ya has añadido esta subcategoría a la categoría');
      this.commonService.handleExceptions(error)
    }
  
    return false;
  }
}
