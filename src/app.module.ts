import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MailModule } from './mail/mail.module';
import { DescuentosModule } from './descuentos/descuentos.module';
import { ProductosModule } from './producto/producto.module';
import { CommonModule } from './common/common.module';
import { MercadopagoModule } from './mercadopago/mercadopago.module';
import { DatabaseErrorHandlingModule } from './database-error-handling/database-error-handling.module';
import { ImageUploadModule } from './image-upload/image-upload.module';
import { CategoriasModule } from './categorias/categorias.module';
import { UploadImageModule } from './upload-image/upload-image.module';
import { OrdenesModule } from './ordenes/ordenes.module';
import { CuponModule } from './cupon/cupon.module';
import { OrdenModule } from './orden/orden.module';
import { ClienteModule } from './cliente/cliente.module';


@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    MongooseModule.forRoot(process.env.DB_URL),
    MercadopagoModule,
    UserModule,
    MailModule,
    DescuentosModule,
    ProductosModule,
    CommonModule,
    DatabaseErrorHandlingModule,
    ImageUploadModule,
    CategoriasModule,
    UploadImageModule,
    OrdenesModule,
    CuponModule,
    OrdenModule,
    ClienteModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
