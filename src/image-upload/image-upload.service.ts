import { Injectable } from '@nestjs/common';
import { CreateImageUploadDto } from './dto/create-image-upload.dto';
import { UpdateImageUploadDto } from './dto/update-image-upload.dto';
import cloudinary from './config/coudinary.config';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
@Injectable()
export class ImageUploadService {
  constructor(){
    cloudinary
  }
  async uploadImages(files: Express.Multer.File[]): Promise<string[]> {
    console.log(files)
    const imageUrls: string[] = [];

    // Sube cada archivo a Cloudinary
    for (const file of files) {
      console.log(file)
      //const tempFolderPath = 'C:\\Users\\enz_9\\Desktop\\IEM DATA\\proyecto1-api\\dist\\temp';
      // Crea la carpeta temp si no existe
      const tempFolderPath = path.join(os.tmpdir(), 'temp');
      console.log(tempFolderPath)
      if (!fs.existsSync(tempFolderPath)) {
        console.log('hola')
        fs.mkdirSync(tempFolderPath);
      }
      const tempFilePath = path.join(tempFolderPath, file.originalname); // Ruta temporal para guardar el archivo
      fs.writeFileSync(tempFilePath, file.buffer); // Guarda el archivo en el sistema de archivos local

      // Parámetros de transformación
      const transformOptions = {
        width: 800, // Ancho deseado en píxeles
        height: 600, // Alto deseado en píxeles
        crop: "fill" // Opción de recorte para ajustar la imagen al tamaño especificado sin distorsión
      };

      const result = await cloudinary.uploader.upload(tempFilePath, {
        public_id: `uploaded_image_${Date.now()}`, transformation: transformOptions})
      imageUrls.push(result.secure_url);
      fs.unlinkSync(tempFilePath); 
    }
    return imageUrls;
  }
  create(createImageUploadDto: CreateImageUploadDto) {
    return 'This action adds a new imageUpload';
  }

  findAll() {
    return `This action returns all imageUpload`;
  }

  findOne(id: number) {
    return `This action returns a #${id} imageUpload`;
  }

  update(id: number, updateImageUploadDto: UpdateImageUploadDto) {
    return `This action updates a #${id} imageUpload`;
  }

  remove(id: number) {
    return `This action removes a #${id} imageUpload`;
  }
}
