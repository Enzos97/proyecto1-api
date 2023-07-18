import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Categoria extends Document {
  @Prop({ unique:true, required: true })
  nombre: string;

  @Prop({ required: false })
  descripcion: string;
  
  @Prop({required: false })
  imagen: string

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Subcategoria' }] })
  subcategorias: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Producto' }] })
  productos: Types.ObjectId[];
}

export const CategoriaSchema = SchemaFactory.createForClass(Categoria);
