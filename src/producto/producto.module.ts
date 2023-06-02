import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductosController } from './producto.controller';
import { ProductosService } from './producto.service';
import { Producto, ProductoSchema } from './entities/producto.entity';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Producto.name, schema: ProductoSchema }]),
    CommonModule
  ],
  controllers: [ProductosController],
  providers: [ProductosService]
})
export class ProductosModule {}
