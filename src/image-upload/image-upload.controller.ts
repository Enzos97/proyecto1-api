import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { ImageUploadService } from './image-upload.service';
import { CreateImageUploadDto } from './dto/create-image-upload.dto';
import { UpdateImageUploadDto } from './dto/update-image-upload.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@Controller('image-upload')
export class ImageUploadController {
  constructor(private readonly imageUploadService: ImageUploadService) {}

  // @Post('upload')
  // @UseInterceptors(FileInterceptor('file'))
  // uploadFile(@UploadedFile() file: Express.Multer.File) {
  //   console.log(file);
  // }
  @Post('prueba')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
    const imageUrls = await this.imageUploadService.uploadImages(files);
    console.log(imageUrls);
  }
  @Post()
  create(@Body() createImageUploadDto: CreateImageUploadDto) {
    return this.imageUploadService.create(createImageUploadDto);
  }

  @Get()
  findAll() {
    return this.imageUploadService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.imageUploadService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateImageUploadDto: UpdateImageUploadDto) {
    return this.imageUploadService.update(+id, updateImageUploadDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.imageUploadService.remove(+id);
  }
}
