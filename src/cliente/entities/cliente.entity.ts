import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { PaymentMethod } from "../types/TypePayment.type";

@Schema()
export class Cliente extends Document {
    @Prop({
        required:true,
        set: (val: string) => val.toLowerCase().trim(),
        get: (val: string) => val,
    })
    fullName:string;

    @Prop({
        required:true,
        unique:true,
        set: (val: string) => val.toLowerCase().trim(),
        get: (val: string) => val,
    })
    email:string;

    @Prop({
        required:true,
        set: (val: string) => val.toLowerCase().trim(),
        get: (val: string) => val,
    })
    dni:string;

    @Prop({
        required:false,
        set: (val: string) => val.toLowerCase().trim(),
        get: (val: string) => val,
    })
    cuit:string;

    @Prop({
        required:true,
        set: (val: string) => val.toLowerCase().trim(),
        get: (val: string) => val,
    })
    address:string;

    @Prop({
        required:false,
        set: (val: string) => val.toLowerCase().trim(),
        get: (val: string) => val,
    })
    department:string;

    @Prop({
        required:true,
        set: (val: string) => val.toLowerCase().trim(),
        get: (val: string) => val,
    })
    zipCode:string;

    @Prop({
        required:true,
        set: (val: string) => val.toLowerCase().trim(),
        get: (val: string) => val,
    })
    city:string;

    @Prop({
        required:true,
        set: (val: string) => val.toLowerCase().trim(),
        get: (val: string) => val,
    })
    province:string; 

    @Prop({
        required:true,
        set: (val: string) => val.toLowerCase().trim(),
        get: (val: string) => val,
    })
    country:string;  
    
    @Prop({required:true})
    paymentMethod:PaymentMethod
}
export const ClienteSchema = SchemaFactory.createForClass(Cliente);