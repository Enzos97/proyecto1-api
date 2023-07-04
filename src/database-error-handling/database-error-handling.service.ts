import { Injectable } from '@nestjs/common';
import { CreateDatabaseErrorHandlingDto } from './dto/create-database-error-handling.dto';
import { UpdateDatabaseErrorHandlingDto } from './dto/update-database-error-handling.dto';
import { DatabaseErrorHandling } from './entities/database-error-handling.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommonService } from 'src/common/common.service';

@Injectable()
export class DatabaseErrorHandlingService {
  constructor(
    @InjectModel(DatabaseErrorHandling.name) 
    private dbErrorHandlingModel: Model<DatabaseErrorHandling>,
    ) {}
  async create(ErrorHandling: any) {
      console.log('dto',ErrorHandling.response)
      const errorToDto:CreateDatabaseErrorHandlingDto= ErrorHandling.response
      //const {statusCode ,} = createDatabaseErrorHandlingDto
      const errorDb = await this.dbErrorHandlingModel.create(errorToDto)
      return errorDb
  }

  findAll() {
    return `This action returns all databaseErrorHandling`;
  }

  findOne(id: number) {
    return `This action returns a #${id} databaseErrorHandling`;
  }

  update(id: number, updateDatabaseErrorHandlingDto: UpdateDatabaseErrorHandlingDto) {
    return `This action updates a #${id} databaseErrorHandling`;
  }

  remove(id: number) {
    return `This action removes a #${id} databaseErrorHandling`;
  }
}
