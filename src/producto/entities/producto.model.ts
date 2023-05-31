import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Producto {
  @Prop({ required: true })
  tipo: string;

  @Prop({ required: true })
  marca: string;

  @Prop({ required: true })
  modelo: string;

  @Prop({ type: [String], required: true })
  colores: string[];

  @Prop({ required: true })
  talle: string;

  @Prop({ required: true })
  precio: number;

  @Prop({ required: true })
  codigo: string;

  @Prop({ required: true })
  genero: string;

  @Prop({ required: true })
  proveedor: string;

  @Prop({ required: true })
  disciplina: string;
}

export const ProductoSchema = SchemaFactory.createForClass(Producto);

