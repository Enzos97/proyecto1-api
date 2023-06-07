import { Type } from "class-transformer";
import { IsArray, IsMongoId, IsOptional, IsString } from "class-validator";

export class CreateSubcategoriaDto {
    @IsString()
    nombre:string;
    
    @IsOptional()
    @IsString()
    descripcion: string;
    @IsOptional()
    @IsString()
    categoria: string

    @IsOptional()
    @IsArray()
    @IsMongoId({each:true})
    @Type(()=>String)
    productos: string[];
}
