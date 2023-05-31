import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Descuento, DescuentoDocument } from './entities/descuento.model';
import { CreateDescuentoDto } from './dto/create-descuento.dto';

@Injectable()
export class DescuentosService {
  constructor(
    @InjectModel(Descuento.name)
    private descuentoModel: Model<DescuentoDocument>,
  ) {}

  async create(createDescuentoDto: CreateDescuentoDto): Promise<Descuento> {
    const createdDescuento = new this.descuentoModel(createDescuentoDto);
    return createdDescuento.save();
  }

  async findAll(): Promise<Descuento[]> {
    return this.descuentoModel.find().exec();
  }

  async findOne(id: string): Promise<Descuento> {
    return this.descuentoModel.findById(id).exec();
  }

  async update(id: string, updateDescuentoDto: CreateDescuentoDto): Promise<Descuento> {
    return this.descuentoModel.findByIdAndUpdate(id, updateDescuentoDto, { new: true }).exec();
  }

  async remove(id: string): Promise<Descuento> {
    return this.descuentoModel.findByIdAndRemove(id).exec();
  }
}
