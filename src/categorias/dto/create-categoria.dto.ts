import { Type } from "class-transformer";
import { IsArray, IsOptional, IsString } from "class-validator";

export class CreateCategoriaDto {
    @IsString()
    nombre: string;
  
    @IsOptional()
    @IsString()
    descripcion: string;
    
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @Type(() => String)
    imagen: string[];
    
    @IsOptional()
    @IsArray()
    @IsString({each:true})
    @Type(()=>String)
    subcategorias: string[]
}
