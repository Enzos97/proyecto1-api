import { Module, forwardRef } from '@nestjs/common';
import { UploadImageService } from './upload-image.service';
import { UploadImageController } from './upload-image.controller';
import { ProductosModule } from 'src/producto/producto.module';
import { CommonModule } from 'src/common/common.module';
import { CategoriasModule } from 'src/categorias/categorias.module';

@Module({
  imports:[
    CommonModule,forwardRef(()=>ProductosModule),
    CommonModule,forwardRef(()=>CategoriasModule),
  ],
  controllers: [UploadImageController],
  providers: [UploadImageService],
  exports: [UploadImageService]
})
export class UploadImageModule {}
