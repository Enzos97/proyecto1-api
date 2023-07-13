import { Type } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Matches, Min } from "class-validator";
import { StatusTypes } from "src/orden/types/StatusTypes.type";
import { SortDirection } from "src/common/types/sort.type";
// import { TypeProduct } from "src/products/types/TypeProduct.type";

export class PaginationDto{
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    @Min(1)
    limit?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    offset?:number;

    @IsOptional()
    @IsString()
    category:string;

    @IsOptional()
    @IsString()
    brand?:string

    @IsOptional()
    @IsString()
    model?:string

    @IsOptional()
    @IsString()
    search?:string

    @IsOptional()
    @IsString()
    orderDate?:SortDirection

    @IsOptional()
    @IsString()
    ascOrDesc?:SortDirection
    
    @IsOptional()
    @IsString()
    totalWithOutDiscount?:SortDirection
    
    @IsOptional()
    @IsString()
    status?:StatusTypes
    
    @IsOptional()
    @IsString()
    version?:string

    // @IsOptional()
    // @IsString()
    // type?:TypeProduct

    @IsOptional()
    @IsString()
    outstanding?: string;
    
    @IsOptional()
    @IsString()
    freeShipping?:string
    
    @IsOptional()
    @IsString()
    show?:string

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    startDate?: string

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    endDate?: string
}