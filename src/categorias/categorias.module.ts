import { Module } from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { CategoriasController } from './categorias.controller';
import { SubcategoriasService } from './subcategorias.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Categoria, CategoriaSchema } from './entities/categoria.entity';
import { Subcategoria, SubcategoriaSchema } from './entities/subcategoria.entity';
import { CommonModule } from 'src/common/common.module';
import { ImageUploadModule } from 'src/image-upload/image-upload.module';
import { UploadImageModule } from 'src/upload-image/upload-image.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Categoria.name, schema: CategoriaSchema },{name:Subcategoria.name,schema:SubcategoriaSchema}]),
    CommonModule,
    ImageUploadModule,
    UploadImageModule
  ],
  controllers: [CategoriasController],
  providers: [CategoriasService,SubcategoriasService],
  exports: [CategoriasService,SubcategoriasService]
})
export class CategoriasModule {}
