import { Type } from "class-transformer";
import { IsArray, IsOptional, IsString } from "class-validator";

export class AddNewPurchaseDto {
    @IsOptional()
    @IsArray()
    @IsString({each:true})
    @Type(()=>String)
    misCompras: string[]
}