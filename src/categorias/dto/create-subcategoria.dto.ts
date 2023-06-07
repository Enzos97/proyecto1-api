import { Type } from "class-transformer";
import { IsArray, IsMongoId, IsOptional, IsString } from "class-validator";

export class CreateSubcategoriaDto {
    @IsString()
    nombre:string;
    
    @IsString()
    descripcion: string;

    @IsString()
    categoria: string

    @IsOptional()
    @IsArray()
    @IsMongoId({each:true})
    @Type(()=>String)
    productos: string[];
}
