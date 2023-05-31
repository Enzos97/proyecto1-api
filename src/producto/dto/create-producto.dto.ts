import { Type } from "class-transformer";
import { IsArray, IsNumber, IsString } from "class-validator";

export class CreateProductoDto {
  @IsString()
  tipo: string;
  
  @IsString()
  marca: string;

  @IsString()
  modelo: string;

  @IsArray()
  @IsString({ each: true })
  @Type(() => String)
  colores: string[];

  @IsString()
  talle: string;

  @IsNumber()
  precio: number;

  @IsString()
  codigo: string;

  @IsString()
  genero: string;

  @IsString()
  proveedor: string;

  @IsString()
  disciplina: string;
}
  
