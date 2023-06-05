import { Module, forwardRef } from '@nestjs/common';
import { DatabaseErrorHandlingService } from './database-error-handling.service';
import { DatabaseErrorHandlingController } from './database-error-handling.controller';
import { CommonModule } from 'src/common/common.module';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseErrorHandling, DatabaseErrorHandlingSchema } from './entities/database-error-handling.entity';

@Module({
  imports:[
    MongooseModule.forFeature([{ name: DatabaseErrorHandling.name, schema: DatabaseErrorHandlingSchema }]),
    ],
  controllers: [DatabaseErrorHandlingController],
  providers: [DatabaseErrorHandlingService],
  exports: [DatabaseErrorHandlingService]
})
export class DatabaseErrorHandlingModule {}
