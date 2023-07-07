import { PartialType } from '@nestjs/mapped-types';
import { CreateOrdeneDto } from './create-ordene.dto';
import { IsArray, IsOptional } from 'class-validator';

export class UpdateOrdeneDto extends PartialType(CreateOrdeneDto) {
    @IsOptional()
    @IsArray()
    productos:any[]
}
