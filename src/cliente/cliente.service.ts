import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { Cliente } from './entities/cliente.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ClienteService {
  constructor(
    @InjectModel(Cliente.name) 
    private clienteModel: Model<Cliente>
  ) {}
  async create(createClienteDto: CreateClienteDto) {
    try {
      console.log(createClienteDto)
      const {fullName, email, dni, cuit, address, department="", city, zipCode, country, province, paymentMethod } = createClienteDto
  
      let findCustomerEmail = await this.clienteModel.findOne({email})
      if(findCustomerEmail){
        findCustomerEmail.address=address
        findCustomerEmail.department=department
        findCustomerEmail.city=city
        findCustomerEmail.zipCode=zipCode
        findCustomerEmail.province=province
        findCustomerEmail.country=country
        findCustomerEmail.paymentMethod=paymentMethod
        await findCustomerEmail.save()
        return {customer:findCustomerEmail,message:'Existing customer updated'};
      }
  
      const newCustomer = await this.clienteModel.create(createClienteDto)
      
      console.log(newCustomer)
      return {customer:newCustomer,message:'New customer created'};
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async findAll() {
    try {
      return await this.clienteModel.find().populate('myOrders')
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  findOne(id: string) {
    return `This action returns a #${id} customer`;
  }

  update(id: string, updateClienteDto: UpdateClienteDto) {
    return `This action updates a #${id} customer`;
  }

  async addOrden(ordenId:string,clientId:string){
    return this.clienteModel.findByIdAndUpdate(
      clientId,
      { $push: { myOrders: ordenId } },
      { new: true },
    );
  }

  async remove(id: string) {
    try {
      const customerRemoved = await this.clienteModel.findByIdAndRemove(id)
      return {customer:customerRemoved,message:`This action removes a #${id} customer`};
    } catch (error) {
      throw new BadRequestException(error)
    }
  }
}
