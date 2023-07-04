import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, ObjectId, Types } from 'mongoose';

@Schema()
export class Cupon extends Document {
    @Prop({required:true, unique:true, minlength:4, maxlength:32, set: (val: string) => val.toLowerCase().trim(), get: (val: string) => val,})
    nombre:string
    @Prop({required:true})
    descuento:number
    @Prop({required:true})
    cantidad:number
    @Prop({default: Date.now})
    creacion:Date
    @Prop({required: true})
    vencimiento:Date
    @Prop({ required:false, type: Types.ObjectId, ref: 'User' })
    userId:Types.ObjectId[]
}
export const CuponSchema = SchemaFactory.createForClass(Cupon);