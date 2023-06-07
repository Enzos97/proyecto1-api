import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoriaDto } from './create-categoria.dto';
import { CreateSubcategoriaDto } from './create-subcategoria.dto';

export class UpdateSubcategoriaDto extends PartialType(CreateSubcategoriaDto) {}
