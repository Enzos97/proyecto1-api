import { ArrayMinSize, ArrayNotEmpty, IsArray, IsBoolean, IsIn, IsMongoId, IsNumber, IsObject, IsOptional, IsString } from "class-validator";
import { ObjectId } from "mongoose";
import { PaymentList, PaymentMethod } from "src/producto/types/TypePayment.type";
import { CompraEstado, EstadoCompraList } from "../types/EstadosDeCompra.type";

export class CreateOrdeneDto {
    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    productos:any[]
    @IsMongoId()
    usuario:ObjectId;
    @IsNumber()
    @IsOptional()
    totalSinDescuento: number;
    @IsNumber()
    @IsOptional()
    cupon: number;
    @IsString()
    @IsOptional()
    nombreCupon: string;
    @IsNumber()
    @IsOptional()
    totalConDescuento: number;
    @IsIn(PaymentList)
    tipoDePago: PaymentMethod;
    @IsBoolean()
    envio: boolean;
    @IsOptional()
    @IsIn(EstadoCompraList)
    estadoDeCompra: CompraEstado;
}
