import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DescuentoDocument = Descuento & Document;

@Schema()
export class Descuento {
  @Prop({ required: true })
  codigo: string;

  @Prop({ required: true })
  porcentajeDescuento: number;

  @Prop({ required: true })
  fechaVencimiento: Date;

  @Prop({ required: true })
  condicionesUso: string;
}

export const DescuentoSchema = SchemaFactory.createForClass(Descuento);
