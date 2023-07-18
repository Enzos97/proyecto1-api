import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCuponDto } from './dto/create-cupon.dto';
import { UpdateCuponDto } from './dto/update-cupon.dto';
import { Cupon } from './entities/cupon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ValidarCuponDto } from './dto/validar-aplicar.dto';

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
      console.log('cupon',cupon)
      if (!cupon) {
        // El cupón no existe
        console.log('no existe')
        return false;
      }
    
      const fechaActual = new Date();
    
      if (cupon.vencimiento < fechaActual || cupon.cantidad <= 0) {
        // El cupón ha vencido o tiene una cantidad menor o igual a 0
        console.log('vencio')
        return false;
      }
    
      return true;
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async applyCupon(validarCuponDto: ValidarCuponDto): Promise<number | string> {
    try {
      const cupon = await this.cuponModel.findOne({ nombre: validarCuponDto.nombre })
      const validateCupon = await this.validateCupon(validarCuponDto.nombre)
      console.log('validacion',validateCupon,cupon)
      if (!validateCupon) {
        // El cupón no existe
        return 'El cupón no existe.';
      }
  
      //const userIdObj = new Types.ObjectId(validarCuponDto.userId);
  
      // if (cupon.userId.includes(userIdObj)) {
      //   // El usuario ya ha usado este cupón
      //   return 'Ya has usado este cupón.';
      // }
  
      if (cupon.userEmail.includes(validarCuponDto.userEmail)) {
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

  
  async restarCupon(validarCuponDto: ValidarCuponDto){
    const cupon = await this.cuponModel.findOne({ nombre: validarCuponDto.nombre });
    //const userIdObj = new Types.ObjectId(validarCuponDto.userId);

    cupon.cantidad -= 1;
    cupon.userEmail.push(validarCuponDto.userEmail);
  
    await cupon.save();
  
    return cupon.descuento;
  }

  async findAll() {
    const cupones = await this.cuponModel.find()
    return cupones
  }

  async findOne(id: string) {
    try {
      const cupon = await this.cuponModel.findById(id)
      return cupon
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async update(id: string, updateCuponDto: UpdateCuponDto) {
    try {
      const { vencimientoEnDias } = updateCuponDto;
  
      // Obtén el cupón existente
      let cupon: Cupon = await this.cuponModel.findById(id);
  
      if (!cupon) {
        throw new BadRequestException('Cupón no encontrado');
      }
  
      if(vencimientoEnDias){
        // Calcula la nueva fecha de vencimiento
        const fechaVencimiento = new Date();
        fechaVencimiento.setDate(fechaVencimiento.getDate() + vencimientoEnDias);
    
        // Actualiza la fecha de vencimiento en el cupón
        cupon.vencimiento = fechaVencimiento;
        // Guarda los cambios en el cupón
        await cupon.save();
      }
      cupon = await this.cuponModel.findByIdAndUpdate(id,updateCuponDto,{new:true}) 

      return cupon;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  

  async remove(id: string) {
    try {
      return await this.cuponModel.findByIdAndRemove(id)
    } catch (error) {
      throw new BadRequestException(error)
    }
  }
}
