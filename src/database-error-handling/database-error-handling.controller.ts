import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DatabaseErrorHandlingService } from './database-error-handling.service';
import { CreateDatabaseErrorHandlingDto } from './dto/create-database-error-handling.dto';
import { UpdateDatabaseErrorHandlingDto } from './dto/update-database-error-handling.dto';

@Controller('database-error-handling')
export class DatabaseErrorHandlingController {
  constructor(private readonly databaseErrorHandlingService: DatabaseErrorHandlingService) {}

  @Post()
  create(@Body() ErrorHandling: any) {
    return this.databaseErrorHandlingService.create(ErrorHandling);
  }

  @Get()
  findAll() {
    return this.databaseErrorHandlingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.databaseErrorHandlingService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDatabaseErrorHandlingDto: UpdateDatabaseErrorHandlingDto) {
    return this.databaseErrorHandlingService.update(+id, updateDatabaseErrorHandlingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.databaseErrorHandlingService.remove(+id);
  }
}
