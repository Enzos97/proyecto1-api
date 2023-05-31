import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DescuentosModule } from './descuentos/descuentos.module';


@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DB_URL),
    DescuentosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
