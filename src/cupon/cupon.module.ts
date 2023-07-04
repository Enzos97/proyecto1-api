import { Module } from '@nestjs/common';
import { CuponService } from './cupon.service';
import { CuponController } from './cupon.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Cupon, CuponSchema } from './entities/cupon.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: Cupon.name, schema: CuponSchema }]),],
  controllers: [CuponController],
  providers: [CuponService],
  exports: [CuponService]
})
export class CuponModule {}
