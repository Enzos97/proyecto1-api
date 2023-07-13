import { Module } from '@nestjs/common';
import { OrdenService } from './orden.service';
import { OrdenController } from './orden.controller';
import { Orden, OrdenSchema } from './entities/orden.entity';
import { ProductoSchema } from 'src/producto/entities/producto.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { ClienteModule } from 'src/cliente/cliente.module';
import { ProductosService } from 'src/producto/producto.service';
import { MercadopagoService } from 'src/mercadopago/mercadopago.service';
import { ProductosModule } from 'src/producto/producto.module';
import { MercadopagoModule } from 'src/mercadopago/mercadopago.module';
import { MailModule } from 'src/mail/mail.module';
import { DatabaseErrorHandlingModule } from 'src/database-error-handling/database-error-handling.module';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Orden.name, schema: OrdenSchema }]),
    ClienteModule,
    ProductosModule,
    MercadopagoModule,
    MailModule,
    CommonModule
  ],
  controllers: [OrdenController],
  providers: [OrdenService]
})
export class OrdenModule {}
