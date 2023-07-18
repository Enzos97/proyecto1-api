import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Types } from "mongoose";

@Schema()
export class Subcategoria {
    @Prop({ type: String, unique:true, required: true })
    nombre:string;
    
    @Prop({ type: String, required: false })
    descripcion: string;

    @Prop({ type: Types.ObjectId, ref: 'Categoria' })
    categoria: Types.ObjectId;

    @Prop({required: false })
    imagen: string

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Producto' }] })
    productos: Types.ObjectId[];
}

export const SubcategoriaSchema = SchemaFactory.createForClass(Subcategoria);