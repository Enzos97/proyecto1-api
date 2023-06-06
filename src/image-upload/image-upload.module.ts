import { Module } from '@nestjs/common';
import { ImageUploadService } from './image-upload.service';
import { ImageUploadController } from './image-upload.controller';

@Module({
  controllers: [ImageUploadController],
  providers: [ImageUploadService],
  exports:[ImageUploadService]
})
export class ImageUploadModule {}
