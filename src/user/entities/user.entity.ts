import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Role } from "../types/role.type";

@Schema()
export class User {
    @Prop({
        unique: true,
        required: true,
        index: true,
        maxlength: 32,
        set: (val: string) => val.toLowerCase().trim(),
        get: (val: string) => val,
      })
      email: string;
    
      @Prop({ required: false })
      password: string;
    
      @Prop({
        maxlength: 128,
        set: (val: string) => val.toLowerCase().trim(), get: (val: string) => val
      })
      name: string;
    
      @Prop({
        maxlength: 128,
        set: (val: string) => val.toLowerCase().trim(), get: (val: string) => val
      })
      lastName: string;
    
      @Prop({
        maxlength: 32,
      })
      phone: string;
      
      @Prop({
        type: String,
      })
      image: string;
    
      @Prop({
        maxlength: 32,
      })
      dni: string;
    
      @Prop({
        default: Role.USER,
      })
      role: Array<string>;
      
      @Prop({
        default:null
      })
      code:number;

      @Prop()
      timestamps: true;
      
}
export const UserSchema = SchemaFactory.createForClass(User);