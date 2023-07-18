import { IsArray, IsEmail, IsNumber, IsOptional, IsPositive, IsString, MaxLength, MinLength } from "class-validator";

export class ValidarCuponDto {
    @IsString()
    @MinLength(4)
    @MaxLength(32)
    nombre: string;
    // @IsOptional()
    // @IsString()
    // userId: string;
    @IsOptional()
    @IsEmail()
    userEmail:string
}