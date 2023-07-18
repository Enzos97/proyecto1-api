import { Producto } from "src/producto/entities/producto.entity"

export interface ProductQuantityNew {
  product:Producto,
  quantity:number
}

export interface ProductQuantityDtoNew {
  product:string,
  quantity:number
}
