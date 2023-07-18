import { Inject, Injectable, forwardRef } from '@nestjs/common';

import { UpdateUploadImageDto } from './dto/update-upload-image.dto';
import { Storage } from '@google-cloud/storage';
import { CommonService } from 'src/common/common.service';
import { ProductosService } from '../producto/producto.service';
import { CreateUploadImageDto } from './dto/create-upload-image.dto';
import { DeleteUploadImageDto } from './dto/delete-upload-image.dto';
import { CategoriasService } from 'src/categorias/categorias.service';
import { SubcategoriasService } from '../categorias/subcategorias.service';
import { Producto } from 'src/producto/entities/producto.entity';
import { Categoria } from 'src/categorias/entities/categoria.entity';

@Injectable()
export class UploadImageService {
  constructor(
    private commonService: CommonService,
    @Inject(forwardRef(() => ProductosService))
    private productoService:ProductosService,
    @Inject(forwardRef(() => CategoriasService))
    private categoriaService: CategoriasService,
    @Inject(forwardRef(() => SubcategoriasService))
    private subcategoriaService:SubcategoriasService
  ){}

  // async uploadImageToStorage(files: Express.Multer.File[]){

  //   const storage = new Storage({
  //     projectId: 'vagimports-backend',
  //     keyFilename: 'vagimports-backend-bd0e2275b698.json',
  //   });
  //   const bucketName = 'vagimport-images';

  //   const imageUrls: string[] = [];

  //   for (const file of files) {
  //   const { originalname, buffer } = file;
  //   const fileName = Date.now() + '_' + originalname;
  
  //   // Crea un objeto de archivo en el bucket de Google Cloud Storage
  //   const fileUpload = await storage.bucket(bucketName).file(fileName);
  
  //   // Carga el contenido del archivo
  //   await fileUpload.save(buffer);
  
  //   // Establece las opciones de acceso público para el archivo
  //   //await fileUpload.makePublic();
  //   imageUrls.push(fileUpload.publicUrl());
  // }
  //   // Retorna la URL pública del archivo
  //   return imageUrls
  // }
  // async imageService(base64Data: string, fileName: string): Promise<string> {
  //   const storage = new Storage({
  //     projectId: 'vagimports-backend',
  //     keyFilename: 'vagimports-backend-bd0e2275b698.json',
  //     timeout: 60000
  //   });
  //   const bucketName = 'vagimport-images';

  //   const buffer = Buffer.from(base64Data, 'base64');

  //   const file = storage.bucket(bucketName).file(fileName);
  //   await file.save(buffer);

  //   // Establecer las opciones de acceso público para el archivo si es necesario
  //   // await file.makePublic();
    
  //   return file.publicUrl()
    
     
  // }
  async uploadFile(name: string, image: string) {
    const projectId = 'elegant-expanse-388600'; // Reemplaza con el ID de tu proyecto en Google Cloud
    const bucketName = 'proyecto1-api'; // Reemplaza con el nombre del bucket en Google Cloud Storage
  
    const storage = new Storage({ projectId });
    const bucket = storage.bucket(bucketName);
  
    // Decodifica el contenido base64 de la imagen
    const imageData = image.replace(/^data:image\/\w+;base64,/, '');
    const imageBuffer = Buffer.from(imageData, 'base64');
  
    const fileName = `${Date.now()}_${name}`;
    
    // Crea un archivo en el bucket de Google Cloud Storage
    const file = bucket.file(fileName);
  
    // Sube el contenido de la imagen al archivo
    await file.save(imageBuffer, {
      metadata: {
        contentType: 'image/jpeg', // Reemplaza con el tipo de contenido adecuado para tus imágenes
      },
    });
  
    const imageUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
  
    // Realiza cualquier otra operación necesaria con la URL de la imagen
  
    return { imageUrl };
  }

  async deleteFile(deleteUploadImageDto: DeleteUploadImageDto) {
    const { id, idProduct, idCategory, idSubcategory } = deleteUploadImageDto;
    console.log(id,idProduct,idCategory,idSubcategory)
    const projectId = 'elegant-expanse-388600'; // Reemplaza con el ID de tu proyecto en Google Cloud
    const bucketName = 'proyecto1-api'; // Reemplaza con el nombre del bucket en Google Cloud Storage
  
    const storage = new Storage({ projectId });
    const bucket = storage.bucket(bucketName);
    let productById;
    let catOrSub;
    if (idProduct) {
      productById = await this.productoService.findOne(idProduct);
    }
    if (idCategory) {
      catOrSub = await this.categoriaService.findOne(idCategory);
    }
    if (idSubcategory) {
      catOrSub = await this.subcategoriaService.findOne(idSubcategory);
    }
  
    // Extrae el nombre del archivo de la URL
    const fileName = id.substring(id.lastIndexOf('/') + 1);
  
    // Obtiene una referencia al archivo en el bucket
    const file = bucket.file(fileName);
  
    try {
      // Elimina el archivo del bucket
      await file.delete();
  
      // Eliminar la URL de la imagen del array 'imagenes'
      if (productById) {
        if (productById.imagenes === id) {
          productById.imagenes = '';
          await productById.save();
        }
        return { success: true, productById };
      }
      if (catOrSub) {
        if (catOrSub.imagen === id) {
          catOrSub.imagen = '';
          await catOrSub.save();
        }
        return { success: true, catOrSub };
      }
    } catch (error) {
      // Maneja el error en caso de que ocurra alguna falla en la eliminación del archivo
      console.error(`Error al eliminar el archivo ${fileName}: ${error}`);
      return { success: false, error };
    }
  }
  
  // async deleteFile(id: string,idProduct:string) {
  //   const projectId = 'vagimports-backend'; // Reemplaza con el ID de tu proyecto en Google Cloud
  //   const bucketName = 'vagimport-images'; // Reemplaza con el nombre del bucket en Google Cloud Storage

  //   const storage = new Storage({ projectId });
  //   const bucket = storage.bucket(bucketName);
  
  //   // Extrae el nombre del archivo de la URL
  //   const fileName = id.substring(id.lastIndexOf('/') + 1);
  
  //   // Obtiene una referencia al archivo en el bucket
  //   const file = bucket.file(fileName);
  //   let productById = await this.productsService.findOne(idProduct)

  //   try {
  //   // Elimina el archivo del bucket
  //   await file.delete();
  
  //   // Eliminar la URL de la imagen del array 'images'
  //   const index = productById.images.findIndex(image => image === id);
  //   if (index > -1) {
  //     productById.images.splice(index, 1);
  //     await productById.save();
  //   }

  //   return { success: true, productById };
  //   } catch (error) {
  //     // Maneja el error en caso de que ocurra alguna falla en la eliminación del archivo
  //     console.error(`Error al eliminar el archivo ${fileName}: ${error}`);
  //     return { success: false, error };
  //   }
  // }
  create(createUploadImageDto: CreateUploadImageDto) {
    return 'This action adds a new uploadImage';
  }

  findAll() {
    return `This action returns all uploadImage`;
  }

  findOne(id: number) {
    return `This action returns a #${id} uploadImage`;
  }

  update(id: number, updateUploadImageDto: UpdateUploadImageDto) {
    return `This action updates a #${id} uploadImage`;
  }

  remove(id: number) {
    return `This action removes a #${id} uploadImage`;
  }
}
