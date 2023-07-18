import { Module, forwardRef } from '@nestjs/common';
import { MercadopagoService } from './mercadopago.service';
import { MercadopagoController } from './mercadopago.controller';
import { OrdenModule } from 'src/orden/orden.module';

@Module({
  imports: [
    forwardRef(()=>OrdenModule),
  ],
  controllers: [MercadopagoController],
  providers: [MercadopagoService],
  exports: [MercadopagoService]
})
export class MercadopagoModule {}
