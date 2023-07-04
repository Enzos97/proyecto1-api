import { Type } from "class-transformer";
import { IsArray, IsMongoId, IsOptional, IsString } from "class-validator";

export class AddProductDto {
    @IsMongoId()
    subcategoriaId: string;

    @IsMongoId()
    productoId: string;
}