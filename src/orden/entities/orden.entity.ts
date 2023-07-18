
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Document } from 'mongoose';
import { ProductQuantity } from 'src/ordenes/interfaces/ProductQuantity.interface';
import { PaymentMethod } from 'src/producto/types/TypePayment.type';
import { StatusTypes } from '../types/StatusTypes.type';

@Schema()
export class Orden {
    @Prop({required:true})
    products:any[]
    @Prop({ required:true, type: Types.ObjectId, ref: 'Cliente' })
    Customer:Types.ObjectId;
    @Prop({required:false})
    totalWithOutDiscount: number;
    @Prop({required:false})
    cupon:string;
    @Prop({required:false})
    discount: number;
    @Prop({required:false})
    totalWithDiscount: number;
    @Prop({required:true})
    payType: PaymentMethod;
    @Prop({required:true})
    shiping: boolean;
    @Prop({required:false,default:Date.now})
    orderDate: Date;
    @Prop({required:false,default:Date.now})
    payDate: Date;
    @Prop({required:false,default:StatusTypes.PENDING})
    status: StatusTypes;
    @Prop({required:false,default:null})
    tokenClient:number;
    @Prop({required:false,default:null})
    proofOfPayment:string[];
    @Prop({required:false,default:false})
    isFacturaA:boolean;
}
export const OrdenSchema = SchemaFactory.createForClass(Orden);