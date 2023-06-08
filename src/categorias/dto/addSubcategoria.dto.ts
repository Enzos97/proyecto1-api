import { Type } from "class-transformer";
import { IsArray, IsMongoId, IsOptional, IsString } from "class-validator";

export class AddSubcategoriaDto {
    @IsMongoId()
    categoriaId: string;
  
    @IsMongoId()
    subcategoriaId: string;
}