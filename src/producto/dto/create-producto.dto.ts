import { Type } from "class-transformer";
import { IsArray, IsNumber, IsString, ValidateNested } from "class-validator";
import { TallesDto } from "./talle-product.dto";
import { Talle } from "../interfaces/talles.interface";

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

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TallesDto)
  talle: Talle[];

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
  
