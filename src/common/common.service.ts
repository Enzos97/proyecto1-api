import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import { DatabaseErrorHandlingService } from 'src/database-error-handling/database-error-handling.service';

@Injectable()
export class CommonService {
  constructor(
    private dbErrorHandlingService: DatabaseErrorHandlingService
  ){}
  handleExceptions(error: any, entity?: string){
    console.log('errorrrr',error)
    this.lowerlevelExceptionHandler(error);
    console.log('Error servicee',error)
    console.error('Error servicee messageeee',error.message);
    
    if (error.code === 11000) {
      this.errorToDb(new BadRequestException({
        statusCode:error.code,
        message: `${entity || 'An entity'} with that ${
          Object.keys(error.keyPattern)[0]
        } already exists in the database ${JSON.stringify(error.keyValue)}`,
        error: error.error
      }))
      throw new BadRequestException({
        statusCode:error.code,
        message: `${entity || 'An entity'} with that ${
          Object.keys(error.keyPattern)[0]
        } already exists in the database ${JSON.stringify(error.keyValue)}`,
        error: error.error
      });
    }

    this.errorToDb(new InternalServerErrorException(
      `Something went wrong. ${error.message}`,
    ))
    throw new InternalServerErrorException(
      `Something went wrong. ${error.message}`,
    );
  }
  private async errorToDb(error:any){
    await this.dbErrorHandlingService.create(error);
  }
  private lowerlevelExceptionHandler(error: any): void {
    if (error.name === 'BadRequestException'){
      this.errorToDb(new BadRequestException(error.message))
      throw new BadRequestException(error.message);
    }
    if (error.name === 'InternalServerErrorException'){
      this.errorToDb(new InternalServerErrorException(error.message))
      throw new InternalServerErrorException(error.message);
    }
    if (error.name === 'NotFoundException'){
      this.errorToDb(new NotFoundException(error.message))
      throw new NotFoundException(error.message);
    }
    if (error.name === 'UnauthorizedException'){
      this.errorToDb(new UnauthorizedException(error.message))
      throw new UnauthorizedException(error.message);
    }
  }
}
