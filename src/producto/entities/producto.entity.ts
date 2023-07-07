import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Talle } from '../interfaces/talles.interface';
import { Types } from 'mongoose';

@Schema()
export class Producto {
  @Prop({ required: true, unique: true })
  codigo: string;
  
  @Prop({required: true, unique:true})
  descripcion: string;
  
  @Prop({require:false})
  qxbulto: number;
  
  @Prop({required:true, default:0})
  stock:number

  @Prop({ required: true })
  precio: number;
  @Prop({ required: false, default:0 })
  preciocondesc:number
  @Prop({ type: String, required: false })
  imagenes: string
  
  @Prop({default:0})
  descuento?: number;
  
  @Prop({default:true})
  isActive:boolean;
  
  @Prop({required:false,default:false})
  destacado:boolean
  
  @Prop({required:false,default:Date.now})
  productoDate: Date;
  // @Prop({ required: true })
  // tipo: string;

  // @Prop({ required: true })
  // marca: string;

  // @Prop({unique: true, required: true })
  // modelo:string

  // @Prop({ type: [String], required: true })
  // colores: string[];

  // @Prop({ required: true })
  // talle: Talle[];
  
  // @Prop({ required: true })
  // genero: string;

  // @Prop({ required: true })
  // proveedor: string;

  // @Prop({ required: true })
  // disciplina: string;

  // @Prop({ type: Types.ObjectId, ref: 'Subcategoria' })
  // subcategoria: Types.ObjectId;
}

export const ProductoSchema = SchemaFactory.createForClass(Producto);

ProductoSchema.pre('save', function () {
  // if (this.talle) {
  //   this.talle = this.talle.map(talle => ({
  //     talle: talle.talle.toUpperCase(),
  //     cantidad: talle.cantidad,
  //   }));
  // }
  // if(this.colores){
  //   this.colores = this.colores.map(color => (
  //     color.toUpperCase()
  //   ));
  // }
  if(this.codigo){
    this.codigo = this.codigo.toUpperCase()
  }
});

