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
        const uploadImages = await this.uploadImageService.uploadFile(createProductoDto.codigo,createProductoDto.imagenes)
        createProductoDto.imagenes=uploadImages.imageUrl
      }

      const createdProduct = await this.productModel.create(createProductoDto);

      if(createProductoDto.descuento===0){
        createdProduct.preciocondesc=createProductoDto.precio
      }
      if(createProductoDto.descuento>0){
        createdProduct.preciocondesc= createProductoDto.precio-((createProductoDto.precio*createProductoDto.descuento)/100)
      }
    
      
      // const category:any = await this.categoriasService.findOne(createProductoDto.tipo);
      // console.log('category',category)
      // if(!category){
      //   throw new NotFoundException('la categoria no existe')
      // }
      // createdProduct.tipo=category.nombre
      // const productoPushCategory = await this.categoriasService.addProduct({subcategoriaId:category._id,productoId:createdProduct.id})
      // console.log('pushCat',productoPushCategory)

      // const subcategory:any = await this.subcategoriaService.findOne(createProductoDto.marca);
      // console.log('subcategory',subcategory)
      // if(!subcategory){
      //   throw new NotFoundException('la subcategoria no existe')
      // }
      // createdProduct.marca=subcategory.nombre
      // const productoPushSubCategory = await this.subcategoriaService.addProduct({subcategoriaId:subcategory._id,productoId:createdProduct.id})
      // console.log('pushSubCat',productoPushSubCategory)
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
      const producto = await this.productModel.findById(id)
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
    console.log('id',id,'dto',updateProductoDto)
    let updateProduct = await this.productModel.findById(id)
    console.log('updateProduct',updateProduct)
    // if (updateProductoDto.talle) {
    //   updateProductoDto.talle = updateProductoDto.talle.map((talle:Talle) => ({
    //     talle: talle.talle.toUpperCase(),
    //     cantidad: talle.cantidad,
    //   }));
    //   updateProduct.talle = updateProductoDto.talle
    // }
    if(updateProductoDto.imagenes){
      const uploadImages = await this.uploadImageService.uploadFile(updateProductoDto.codigo||updateProduct.codigo,updateProductoDto.imagenes)
      updateProduct.imagenes=uploadImages.imageUrl||updateProduct.imagenes
    }
    if(updateProductoDto.descuento===0){
      console.log('entre')
      console.log('entre mal')
      updateProduct.descuento = updateProductoDto.descuento || updateProduct.descuento;
      updateProduct.preciocondesc= updateProductoDto.precio||updateProduct.precio
    }
    if(updateProductoDto.descuento>0){
      console.log('entre2')
      updateProduct.descuento = updateProductoDto.descuento || updateProduct.descuento;
      updateProduct.preciocondesc= (updateProductoDto.precio||updateProduct.precio)-((updateProductoDto.precio||updateProduct.precio)*(updateProductoDto.descuento||updateProduct.descuento))/100
    }

    // updateProduct.modelo = updateProductoDto.modelo || updateProduct.modelo;
    updateProduct.stock = updateProductoDto.stock || updateProduct.stock
    updateProduct.codigo = updateProductoDto.codigo || updateProduct.codigo;
    updateProduct.descripcion = updateProductoDto.descripcion || updateProduct.descripcion;
    updateProduct.precio = updateProductoDto.precio || updateProduct.precio;
    updateProduct.isActive=updateProductoDto.hasOwnProperty('isActive')?updateProductoDto.isActive:updateProduct.isActive;
    updateProduct.destacado=updateProductoDto.hasOwnProperty('destacado')?updateProductoDto.destacado:updateProduct.destacado;
    // updateProduct.colores = updateProductoDto.colores || updateProduct.colores;
    // updateProduct.marca = updateProductoDto.marca || updateProduct.marca;
    // updateProduct.tipo = updateProductoDto.tipo || updateProduct.tipo;
    // updateProduct.genero = updateProductoDto.genero || updateProduct.genero;
    // updateProduct.proveedor = updateProductoDto.proveedor || updateProduct.proveedor;
    // updateProduct.disciplina = updateProductoDto.disciplina || updateProduct.disciplina;
    // updateProductDto.hasOwnProperty('freeShipping')
    // ? updateProductDto.freeShipping
    // : productFind.freeShipping;
    //const updateProduct = await this.productModel.findByIdAndUpdate(id, updateProductoDto, { new: true }).exec();
    console.log(1,updateProduct)
    await updateProduct.save()
    console.log(2,updateProduct)
    return updateProduct

  }
  async updateStock(productId: string, stockTalles: Talle[]): Promise<void> {
    await this.productModel.findByIdAndUpdate(
      productId,
      { talle: stockTalles },
      { new: true }
    );
  }

  async remove(id: string): Promise<Producto> {
    return this.productModel.findByIdAndRemove(id).exec();
  }
}
