import { IsNumber, IsString } from "class-validator";
import { Transform } from 'class-transformer';

export class TallesDto {
    @IsString()
    @Transform(({ value }) => value.toUpperCase())
    talle:string
    @IsNumber()
    cantidad:number
}