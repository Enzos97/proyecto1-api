import { IsOptional, IsString } from "class-validator";

export class DeleteUploadImageDto {
    @IsString()
    id: string;
  
    @IsOptional()
    @IsString()
    idProduct: string;

    @IsOptional()
    @IsString()
    idCategory: string;

    @IsOptional()
    @IsString()
    idSubcategory: string;
}
