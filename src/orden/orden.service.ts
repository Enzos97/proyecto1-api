import { BadGatewayException, BadRequestException, HttpException, HttpStatus, Inject, Injectable, InternalServerErrorException, NotFoundException, forwardRef } from '@nestjs/common';
import { CreateOrdenDto } from './dto/create-orden.dto';
import { UpdateOrdenDto } from './dto/update-orden.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Orden } from './entities/orden.entity';
import { Model, Query } from 'mongoose';
import { ProductQuantity } from 'src/ordenes/interfaces/ProductQuantity.interface';
import { ClienteService } from '../cliente/cliente.service';
import { ProductosService } from 'src/producto/producto.service';
import { ProductQuantityNew } from './interfaces/ProductQuantity.interface';
import { MercadopagoService } from 'src/mercadopago/mercadopago.service';
import { MailService } from 'src/mail/mail.service';
import { PaymentMethod } from 'src/cliente/types/TypePayment.type';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CommonService } from 'src/common/common.service';
import moment from 'moment';
import { StatusTypes } from './types/StatusTypes.type';
import { Producto } from 'src/producto/entities/producto.entity';
import { CuponService } from 'src/cupon/cupon.service';
@Injectable()
export class OrdenService {
  constructor(
    @InjectModel(Orden.name) 
    private readonly ordenModel: Model<Orden>,
    private readonly clienteService:ClienteService,
    private readonly productsService:ProductosService,
    @Inject(forwardRef(() => MercadopagoService))
    private readonly mercadopagoService:MercadopagoService,
    private readonly mailService:MailService,
    private readonly cuponService:CuponService,
    private readonly commonService:CommonService,
  ) {}
  async create(createOrdenDto: CreateOrdenDto) {

    let productsWithDetails: ProductQuantity[] = [];
    let totalWithoutDiscount = 0;
    let totalWithDiscount = 0;
    const customerEmail = createOrdenDto.Customer.email     

    const customer = await this.clienteService.create(createOrdenDto.Customer)
    const customerFullName = createOrdenDto.Customer.fullName
    console.log("customerFullName",customerFullName);
    
    for (const product of createOrdenDto.products) {
      // Buscar el producto por su ID
      const productFromDB = await this.productsService.findOne(product.product);
      console.log('productFromDB',productFromDB)
      if (!productFromDB) {
        throw new Error(`Product with ID ${product.product} not found`);
      }
  
      // Crear un objeto ProductQuantity con el producto y la cantidad
      const productWithDetails: ProductQuantity = {
        producto: productFromDB,
        cantidad: product.quantity,
      };
  
      // // Calcular el descuento adicional para este producto
      // const additionalDiscount = productFromDB.descuento || 0;
  
      // Actualizar el descuento del producto sumando el descuento adicional
      //productWithDetails.producto.descuento = productWithDetails.producto.descuento + additionalDiscount;
      
      // Calcular el total sin descuento y el total con descuento para este producto
      const subtotalWithoutDiscount = product.quantity * productFromDB.precio;
      const subtotalWithDiscount = subtotalWithoutDiscount * (1 - productWithDetails.producto.descuento / 100);
  
      // Sumar al total general
      totalWithoutDiscount += subtotalWithoutDiscount;
      totalWithDiscount += subtotalWithDiscount;
  
      // Agregar el producto con detalles al array
      productsWithDetails.push(productWithDetails);
    }
    createOrdenDto.Customer=customer.customer.id
    createOrdenDto.products=productsWithDetails
    createOrdenDto.totalWithDiscount=totalWithDiscount
    createOrdenDto.totalWithOutDiscount=totalWithoutDiscount
    try {
      let newOrder = await this.ordenModel.create(createOrdenDto)
      if(newOrder.payType==PaymentMethod.MERCADOPAGO){
        const ordenMP= {
          items : newOrder.products,
          id: newOrder.id,
          discount: newOrder.discount||0
        }
        try {
          let code = this.generateCode()
          
          newOrder.tokenClient=code
          if(createOrdenDto.discount!==0){
            await this.aplicarCuponDescuento(newOrder.id,createOrdenDto.discount,productsWithDetails)
          }
          await newOrder.save()
          await newOrder.populate('Customer')
          await this.mailService.send_code_mail_for_order(customerEmail,newOrder.id,code,newOrder, customerFullName)
          await this.clienteService.addOrden(newOrder.id,createOrdenDto.Customer.toString())
          let linkMP = await this.mercadopagoService.create(ordenMP)
          
          return {orden:newOrder, linkMP:linkMP, cupon:await this.cuponService.applyCupon({nombre:createOrdenDto.cupon,userEmail:createOrdenDto.Customer.email}) }
        } catch (error) {
          throw new BadRequestException(error)
        }
      }
      if(newOrder.payType==PaymentMethod.TRANSFERENCIA){
        let code = this.generateCode()
        console.log('code',code)
        newOrder.tokenClient=code
        await newOrder.save()
        newOrder.populate('Customer')
        await this.mailService.send_code_mail_Transferencia(customerEmail,newOrder.id,code)
        await this.clienteService.addOrden(newOrder.id,createOrdenDto.Customer.toString())
        return {orden:newOrder }
      }
      if(newOrder.payType==PaymentMethod.DEPOSITO){
        let code = this.generateCode()
        console.log('code',code)
        newOrder.tokenClient=code
        await newOrder.save()
        newOrder.populate('Customer')
        await this.mailService.send_code_mail_Deposito(customerEmail,newOrder.id,code)
        await this.clienteService.addOrden(newOrder.id,createOrdenDto.Customer.toString())
        return {orden:newOrder }
      }
      let code = this.generateCode()
      newOrder.tokenClient=code
      await newOrder.save()
      newOrder.populate('Customer')
      return newOrder
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async findAll(paginationDto:PaginationDto) {
    try {
      // const allOrders = await this.ordenModel.find()
      // return allOrders
      const { limit = 10, offset = 1, status } = paginationDto;

      const query = this.ordenModel.find().populate('Customer');

      if (status) {
        query.where('status', status);
      }

      let totalElements:number = await this.ordenModel.countDocuments(query).exec()
      let currentpage:number;
      let maxpages:number;
      let orders:any

      if (offset > 0) {
        orders = await query
          .find()
          .limit(limit)
          .skip((offset - 1)*limit)
          .sort({ no: 1 })
      }

      if(totalElements>0){
        if(totalElements%limit==0){
          maxpages=totalElements/limit
          currentpage=offset==0?offset+1:offset
        }
          maxpages=totalElements/limit
          maxpages= Math.ceil(maxpages)
          currentpage=(offset>0?offset:offset+1)
      }
      return {
        orders,
        totalElements,
        maxpages,
        currentpage,
      };
    } catch (error) {
      await this.commonService.handleExceptions(error)
    }
  }

  async getOrdenesByDateRange( paginationDto:PaginationDto): Promise<Orden[]> {
    const {startDate, endDate, status} = paginationDto;
    try {
      
      const startDateFormatted = moment(startDate, 'DD.MM.YYYY').toDate();
      const endDateFormatted = moment(endDate, 'DD.MM.YYYY').toDate();
      let ordenes: Query<Orden[], Orden>
      if(startDate&&endDate){
        if(!status){
           ordenes = this.ordenModel.find({
            orderDate: {
              $gte: moment(startDateFormatted).startOf('day').toDate()||Date(),
              $lte: moment(endDateFormatted).endOf('day').toDate()||Date(),
            },
          });
        }else{
          ordenes = this.ordenModel.find({
            status:status,
            orderDate: {
              $gte: moment(startDateFormatted).startOf('day').toDate(),
              $lte: moment(endDateFormatted).endOf('day').toDate(),
            },
          });
        }
        return await ordenes.exec();
      } else{
        throw new BadRequestException('Debe ingresar una fecha de inicio y una final.')
      }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async aplicarCuponDescuento( ordenId:string, cupon: number, productos: ProductQuantity[] ) {
    let totalDescuentos = 0;
    let orden = await this.ordenModel.findById(ordenId)
  // Aplicar el descuento solo a los productos sin descuento
  for (const product of productos) {
    if (product.producto.descuento === 0) {
      // Aplicar el descuento al precio del producto
      product.producto.preciocondesc = product.producto.precio * (1 - (cupon / 100));
    }

    // Calcular el total con descuento del producto y sumarlo a la variable totalDescuentos
    totalDescuentos += product.producto.preciocondesc * product.cantidad;
  }

    // Calcular el nuevo totalWithDiscount sumando totalDescuentos a totalWithOutDiscount
    orden.totalWithDiscount = totalDescuentos;
    orden.products = productos;

    return await this.ordenModel.findByIdAndUpdate(ordenId,orden,{new:true})
  }

  async findOne(id: string) {
    return await this.ordenModel.findById(id)
  }

  async update(id: string, updateOrdenDto: UpdateOrdenDto) {
    const { status } = updateOrdenDto;
  
    // Obtén la orden existente
    const orden: Orden = await this.ordenModel.findById(id);
  
    // Verifica si el estado ha cambiado a "ACEPTADO"
    if (status === StatusTypes.ACCEPTED && orden.status !== StatusTypes.ACCEPTED) {
      // Recorre los productos de la orden y actualiza el stock
      for (const product of orden.products) {
        const producto: any = await this.productsService.findOne(product.producto._id);
  
        // Resta la cantidad del stock
        producto.stock -= product.cantidad;
  
        // Guarda los cambios en el producto
        await producto.save()
      }
    }
  
    // Actualiza el estado de la orden
    orden.status = status;
  
    // Guarda los cambios en la orden
    await this.ordenModel.findByIdAndUpdate(id,orden,{new:true})

    return orden

  }
  
  remove(id: number) {
    return `This action removes a #${id} orden`;
  }
  ////////////////////////////////Client/////////////////////////
  async findByCode(code:number){
    const order = await this.ordenModel.findOne({tokenClient:code}).populate('Customer')
    if (!order){
      throw new NotFoundException('el codigo ingresado es incorrecto.')
    }
    return order
  }
  ////////////////////////////////Helper/////////////////////////
  generateCode(){
    const code = Math.floor(Math.random() * (999999 - 100000 + 1) + 100000);  
    return code
  }
}
