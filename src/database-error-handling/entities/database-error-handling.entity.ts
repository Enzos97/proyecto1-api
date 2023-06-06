import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class DatabaseErrorHandling {
    @Prop({type:Number})
    statusCode:number;
    @Prop({type:String})
    message:string;
    @Prop({type:String})
    error:string;
}
export const DatabaseErrorHandlingSchema = SchemaFactory.createForClass(DatabaseErrorHandling);