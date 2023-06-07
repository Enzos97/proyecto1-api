import { Type } from "class-transformer";
import { IsArray, IsString } from "class-validator";

export class CreateCategoriaDto {
    @IsString()
    nombre: string;
  
    @IsString()
    descripcion: string;
  
    @IsArray()
    @IsString({each:true})
    @Type(()=>String)
    subcategorias: string[]
}
