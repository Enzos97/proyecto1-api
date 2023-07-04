import { Producto } from "src/producto/entities/producto.entity"


export interface ProductQuantity {
  producto:Producto,
  cantidad:number,
  size:string
}

export interface ProductQuantityDto {
  producto:string,
  cantidad:number
  size:string
}
