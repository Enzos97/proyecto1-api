import { Injectable } from '@nestjs/common';
import { CreateImageUploadDto } from './dto/create-image-upload.dto';
import { UpdateImageUploadDto } from './dto/update-image-upload.dto';
import cloudinary from './config/coudinary.config';

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
      const result = await cloudinary.uploader.upload(file.path); // Sube el archivo a Cloudinary
      imageUrls.push(result.secure_url); // Agrega la URL de la imagen al arreglo de URLs
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
