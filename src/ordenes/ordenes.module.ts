import { Module } from '@nestjs/common';
import { OrdenesService } from './ordenes.service';
import { OrdenesController } from './ordenes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdenSchema, Ordene } from './entities/ordene.entity';
import { ProductosModule } from 'src/producto/producto.module';
import { CommonModule } from 'src/common/common.module';
import { MercadopagoModule } from 'src/mercadopago/mercadopago.module';
import { UserModule } from 'src/user/user.module';
import { CuponModule } from 'src/cupon/cupon.module';
import { CuponService } from 'src/cupon/cupon.service';

@Module({
  imports:[
    MongooseModule.forFeature([{ name: Ordene.name, schema: OrdenSchema }]),
    ProductosModule,
    MercadopagoModule,
    CommonModule,
    UserModule,
    CuponModule
  ],
  controllers: [OrdenesController],
  providers: [OrdenesService]
})
export class OrdenesModule {}
