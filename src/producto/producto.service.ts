import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Producto } from './entities/producto.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { CommonService } from 'src/common/common.service';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { Talle } from './interfaces/talles.interface';
import { NotFoundException } from '@nestjs/common/exceptions';
import { CategoriasService } from 'src/categorias/categorias.service';
import { SubcategoriasService } from 'src/categorias/subcategorias.service';
import { UploadImageService } from 'src/upload-image/upload-image.service';

@Injectable()
export class ProductosService {
  constructor(
    @InjectModel(Producto.name) 
    private productModel: Model<Producto>,
    private commonService: CommonService,
    private categoriasService:CategoriasService,
    private subcategoriaService:SubcategoriasService,
    private uploadImageService:UploadImageService
    ) {}

  async create(createProductoDto:CreateProductoDto): Promise<Producto> {
    try{
      console.log('productDto',createProductoDto)
      if(createProductoDto.imagenes){
        const uploadImages = await this.uploadImageService.uploadFiles(createProductoDto.modelo,createProductoDto.imagenes)
        createProductoDto.imagenes=uploadImages.imageUrls
      }
      const createdProduct = await this.productModel.create(createProductoDto);

      const category:any = await this.categoriasService.findOne(createProductoDto.tipo);
      console.log('category',category)
      if(!category){
        throw new NotFoundException('la categoria no existe')
      }
      createdProduct.tipo=category.nombre
      const productoPushCategory = await this.categoriasService.addProduct({subcategoriaId:category._id,productoId:createdProduct.id})
      console.log('pushCat',productoPushCategory)

      const subcategory:any = await this.subcategoriaService.findOne(createProductoDto.marca);
      console.log('subcategory',subcategory)
      if(!subcategory){
        throw new NotFoundException('la subcategoria no existe')
      }
      createdProduct.marca=subcategory.nombre
      const productoPushSubCategory = await this.subcategoriaService.addProduct({subcategoriaId:subcategory._id,productoId:createdProduct.id})
      console.log('pushSubCat',productoPushSubCategory)
      await createdProduct.save()
      return createdProduct
    }catch(error){
      this.commonService.handleExceptions(error)
    }
  }
  async findAll(): Promise<Producto[]> {
    return this.productModel.find().exec();
  }

  async findOne(id: string) {
    try{
      const producto = (await this.productModel.findById(id)).populate('tipo');
      if(!producto) {
        let notFoundError = new NotFoundException('Product not found');
        this.commonService.handleExceptions(notFoundError.getResponse())
      }
      return producto
    }catch(error){
      this.commonService.handleExceptions(error)
    };
  }

  async update(id: string, updateProductoDto:UpdateProductoDto): Promise<Producto> {
    console.log(id,updateProductoDto)
    let updateProduct = await this.productModel.findById(id)
    console.log('updateProduct',updateProduct)
    if (updateProductoDto.talle) {
      updateProductoDto.talle = updateProductoDto.talle.map((talle:Talle) => ({
        talle: talle.talle.toUpperCase(),
        cantidad: talle.cantidad,
      }));
      updateProduct.talle = updateProductoDto.talle
    }
    if(updateProductoDto.imagenes){
      const uploadImages = await this.uploadImageService.uploadFiles(updateProductoDto.modelo||updateProduct.modelo,updateProductoDto.imagenes)
      updateProduct.imagenes=[...updateProduct.imagenes, ...uploadImages.imageUrls]
    }

    updateProduct.modelo = updateProductoDto.modelo || updateProduct.modelo;
    updateProduct.descripcion = updateProductoDto.descripcion || updateProduct.descripcion;
    updateProduct.precio = updateProductoDto.precio || updateProduct.precio;
    updateProduct.colores = updateProductoDto.colores || updateProduct.colores;
    updateProduct.marca = updateProductoDto.marca || updateProduct.marca;
    updateProduct.tipo = updateProductoDto.tipo || updateProduct.tipo;
    updateProduct.codigo = updateProductoDto.codigo || updateProduct.codigo;
    updateProduct.genero = updateProductoDto.genero || updateProduct.genero;
    updateProduct.proveedor = updateProductoDto.proveedor || updateProduct.proveedor;
    updateProduct.disciplina = updateProductoDto.disciplina || updateProduct.disciplina;
    updateProduct.isActive = updateProductoDto.isActive || updateProduct.isActive;
    updateProduct.destacado = updateProductoDto.destacado || updateProduct.destacado
    updateProduct.descuento = updateProductoDto.descuento || updateProduct.descuento
    //const updateProduct = await this.productModel.findByIdAndUpdate(id, updateProductoDto, { new: true }).exec();
    await updateProduct.save()
    console.log(updateProduct)
    return updateProduct

  }

  async remove(id: string): Promise<Producto> {
    return this.productModel.findByIdAndRemove(id).exec();
  }
}
