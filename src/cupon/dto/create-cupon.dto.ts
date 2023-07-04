import { IsNumber, IsPositive, IsString, MaxLength, MinLength } from "class-validator";

export class CreateCuponDto {
    @IsString()
    @MinLength(4)
    @MaxLength(32)
    nombre: string;
  
    @IsNumber()
    descuento: number;
  
    @IsNumber()
    @IsPositive()
    cantidad: number;
  
    @IsNumber()
    @IsPositive()
    vencimientoEnDias: number;
}
