
import { ArrayMinSize, ArrayNotEmpty, IsArray, IsBoolean, IsEmpty, IsIn, IsNumber, IsObject, IsOptional, IsString, Max, ValidateNested } from "class-validator";
import { Cliente } from "src/cliente/entities/cliente.entity";
import { PaymentList, PaymentMethod } from "src/cliente/types/TypePayment.type";
import { StatusList, StatusTypes } from '../types/StatusTypes.type';
export class CreateOrdenDto {
    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    products:any[]

    @IsObject()
    Customer:Cliente;

    @IsNumber()
    @IsOptional()
    totalWithOutDiscount: number;

    @IsOptional()
    @IsString()
    cupon:string;
    
    @IsNumber()
    @IsOptional()
    discount: number;

    @IsNumber()
    @IsOptional()
    totalWithDiscount: number;

    @IsIn(PaymentList)
    //@IsOptional()
    payType: PaymentMethod;
    
    @IsBoolean()
    //@IsEmpty()
    shiping: boolean;

    @IsString()
    @IsOptional()
    orderDate: Date;

    @IsString()
    @IsOptional()
    payDate: Date;

    @IsIn(StatusList)
    @IsOptional()
    status: StatusTypes;

    @IsOptional()
    @IsNumber()
    tokenClient:number;

    @IsOptional()
    proofOfPayment:string[]
    
    @IsOptional()
    @IsBoolean()
    isFacturaA:boolean
}
