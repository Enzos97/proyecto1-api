import { ObjectId } from "mongoose";
import { ProductQuantity, ProductQuantityDto } from "../interfaces/ProductQuantity.interface";
import { ArrayMinSize, ArrayNotEmpty, IsArray, IsMongoId, IsOptional } from 'class-validator';

export class AddOrUpdateProductDto {
    @IsOptional()
    @IsArray()
    productos:ProductQuantityDto[]
    @IsMongoId()
    orderId:ObjectId;
}
