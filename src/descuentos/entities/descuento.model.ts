import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

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
