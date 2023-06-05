import { PartialType } from '@nestjs/mapped-types';
import { CreateDatabaseErrorHandlingDto } from './create-database-error-handling.dto';

export class UpdateDatabaseErrorHandlingDto extends PartialType(CreateDatabaseErrorHandlingDto) {}
