import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCuponDto } from './dto/create-cupon.dto';
import { UpdateCuponDto } from './dto/update-cupon.dto';
import { Cupon } from './entities/cupon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class CuponService {
  constructor(
    @InjectModel(Cupon.name) 
    private readonly cuponModel: Model<Cupon>,
  ){}
  async create(createCuponDto: CreateCuponDto) {    
    try {
      const { nombre, descuento, cantidad, vencimientoEnDias } = createCuponDto;
      const fechaVencimiento = new Date();
      
      fechaVencimiento.setDate(fechaVencimiento.getDate() + vencimientoEnDias);

      const createdCupon = new this.cuponModel({
        nombre,
        descuento,
        cantidad,
        vencimiento:fechaVencimiento,
      });
      
      return await createdCupon.save();
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async validateCupon(nombre: string): Promise<boolean> {
    try {
      const cupon = await this.cuponModel.findOne({nombre});
    
      if (!cupon) {
        // El cupón no existe
        return false;
      }
    
      const fechaActual = new Date();
    
      if (cupon.vencimiento < fechaActual || cupon.cantidad <= 0) {
        // El cupón ha vencido o tiene una cantidad menor o igual a 0
        return false;
      }
    
      return true;
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async applyCupon(userId: string, cuponNombre: string): Promise<number | string> {
    try {
      const cupon = await this.cuponModel.findOne({ nombre: cuponNombre });
      const validateCupon = await this.validateCupon(cuponNombre)
      if (!validateCupon) {
        // El cupón no existe
        return 'El cupón no existe.';
      }
  
      const userIdObj = new Types.ObjectId(userId);
  
      if (cupon.userId.includes(userIdObj)) {
        // El usuario ya ha usado este cupón
        return 'Ya has usado este cupón.';
      }
  
      // cupon.cantidad -= 1;
      // cupon.userId.push(userIdObj);
  
      // await cupon.save();
  
      return cupon.descuento;
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async restarCupon(userId: string, cuponNombre: string){
    const cupon = await this.cuponModel.findOne({ nombre: cuponNombre });
    const userIdObj = new Types.ObjectId(userId);

    cupon.cantidad -= 1;
    cupon.userId.push(userIdObj);
  
    await cupon.save();
  
    return cupon.descuento;
  }

  async findAll() {
    const cupones = await this.cuponModel.find()
    return cupones
  }

  findOne(id: number) {
    return `This action returns a #${id} cupon`;
  }

  update(id: number, updateCuponDto: UpdateCuponDto) {
    return `This action updates a #${id} cupon`;
  }

  remove(id: number) {
    return `This action removes a #${id} cupon`;
  }
}
