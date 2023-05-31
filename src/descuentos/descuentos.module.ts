import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Descuento, DescuentoSchema } from './entities/descuento.model';
import { DescuentosService } from './descuentos.service';
import { DescuentosController } from './descuentos.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Descuento.name, schema: DescuentoSchema }
    ])
  ],
  controllers: [DescuentosController],
  providers: [DescuentosService],
})
export class DescuentosModule {}
