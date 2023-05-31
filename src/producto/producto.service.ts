import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Producto } from './entities/producto.model';

@Injectable()
export class ProductosService {
  constructor(@InjectModel(Producto.name) private productModel: Model<Producto>) {}

  async create(product: Producto): Promise<Producto> {
    console.log(product)
    const createdProduct = new this.productModel(product);
    return createdProduct.save();
  }

  async findAll(): Promise<Producto[]> {
    return this.productModel.find().exec();
  }

  async findOne(id: string): Promise<Producto> {
    return this.productModel.findById(id).exec();
  }

  async update(id: string, product: Producto): Promise<Producto> {
    return this.productModel.findByIdAndUpdate(id, product, { new: true }).exec();
  }

  async remove(id: string): Promise<Producto> {
    return this.productModel.findByIdAndRemove(id).exec();
  }
}
