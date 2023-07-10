import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { ProductQuantity } from "../interfaces/ProductQuantity.interface";
import { PaymentMethod } from "src/producto/types/TypePayment.type";
import { CompraEstado } from "../types/EstadosDeCompra.type";

@Schema()
export class Ordene extends Document {
    @Prop({required:true})
    productos:ProductQuantity[]
    @Prop({ required:true, type: Types.ObjectId, ref: 'User' })
    usuario:Types.ObjectId;
    @Prop({required:false})
    totalSinDescuento: number;
    @Prop({required:false,default:null})
    nombreCupon:string;
    @Prop({required:false, default:0})
    cupon: number;
    @Prop({required:false})
    totalConDescuento: number;
    @Prop({required:true})
    tipoDePago: PaymentMethod;
    @Prop({required:true})
    envio: boolean;
    @Prop({required:false,default:Date.now})
    creacion: Date;
    @Prop({required:false,default:CompraEstado.PENDIENTE})
    estadoDeCompra: CompraEstado;
}
export const OrdenesSchema = SchemaFactory.createForClass(Ordene);