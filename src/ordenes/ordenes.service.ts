import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrdeneDto } from './dto/create-ordene.dto';
import { UpdateOrdeneDto } from './dto/update-ordene.dto';
import { Model } from 'mongoose';
import { Ordene } from './entities/ordene.entity';
import { InjectModel } from '@nestjs/mongoose';
import { ProductQuantity } from './interfaces/ProductQuantity.interface';
import { ProductosService } from 'src/producto/producto.service';
import { MercadopagoService } from 'src/mercadopago/mercadopago.service';
import { PaymentMethod } from 'src/producto/types/TypePayment.type';
import { UserService } from 'src/user/user.service';
import { CompraEstado } from './types/EstadosDeCompra.type';
import { CuponService } from 'src/cupon/cupon.service';
import { log } from 'console';
import { AddOrUpdateProductDto } from './dto/addOrUpdateProduct.dto';

@Injectable()
export class OrdenesService {
  constructor(
    @InjectModel(Ordene.name) 
    private readonly ordenModel: Model<Ordene>,
    private readonly productsService: ProductosService,
    private readonly mercadopagoService:MercadopagoService,
    private readonly userService:UserService,
    private readonly cuponService:CuponService
  ){

  }
    //FALTA
    //*Probar el cupon
    //*Generar el RES de CUPON
    //*Generar su Validacion
    //*Añadir Productos A la Orden (restando del stock)
    //*Sacar Productos A la Orden (sumar al stock)
    //eliminar Orden y devolver productos al stock
    async create(createOrdeneDto: CreateOrdeneDto): Promise<{ orden: Ordene; link: string; } | { orden: Ordene; }>{
      // Obtener los productos y su información completa
      const productosPromises = createOrdeneDto.productos.map(async (productoDto) => {
        const producto = await this.productsService.findOne(productoDto.producto);
        if (!producto) {
          throw new NotFoundException(`Producto con ID '${productoDto.producto}' no encontrado.`);
        }
        return {
          producto,
          cantidad: productoDto.cantidad,
        };
      });
      const productos = await Promise.all(productosPromises);
      
      // Restar el stock de los productos
      // Calcular el total sin descuento
      let totalSinDescuento = 0;
      let totalConDescuento = 0
      for (let producto of productos) {
        totalSinDescuento += producto.producto.precio * producto.cantidad;
        totalConDescuento = totalSinDescuento
      }
      for (let producto of productos) {
        if (producto.producto.descuento !== 0) {
          let subtotalProducto = producto.producto.precio * producto.cantidad;
          let descuentoProducto = (subtotalProducto * producto.producto.descuento) / 100;
          console.log(subtotalProducto,descuentoProducto);
          
          console.log(0,totalSinDescuento,totalConDescuento);
          totalConDescuento -= descuentoProducto;
        }
        console.log(1,totalSinDescuento,totalConDescuento);

      }
      console.log(2,totalSinDescuento,totalConDescuento);
      
      // Aplicar el descuento si está presente
      if (createOrdeneDto.cupon) {
        for (const producto of productos) {
          if (producto.producto.descuento === 0) {
            const subtotalProducto = producto.producto.precio * producto.cantidad;
            const descuentoProducto = (subtotalProducto * createOrdeneDto.cupon) / 100;
            totalConDescuento -= descuentoProducto;
          }
          await producto.producto.save();
        }
      }
  
      // Crear la orden de compra
      const nuevaOrden = new this.ordenModel({
        productos,
        usuario: createOrdeneDto.usuario,
        totalSinDescuento,
        descuento: createOrdeneDto.cupon,
        totalConDescuento,
        tipoDePago: createOrdeneDto.tipoDePago,
        envio: createOrdeneDto.envio,
        creacion: new Date(),
        cupon: createOrdeneDto.cupon,
        nombreCupon: createOrdeneDto.nombreCupon
      });
      
      //guardarOrdenEnPerfilDelUsusario
      await this.userService.addNewPurchase(createOrdeneDto.usuario.toString(), nuevaOrden.id)

      // Guardar la orden en la base de datos
      const ordenGuardada = await nuevaOrden.save();
      let linkMp:string;

      if(createOrdeneDto.estadoDeCompra===CompraEstado.ACEPTADO){
        if (createOrdeneDto.tipoDePago === PaymentMethod.MERCADOPAGO) {
          const mercadopagoDto = productos.map((producto) => ({
            producto: producto.producto,
            cantidad: producto.cantidad,
          }));
          const paymentLink = await this.mercadopagoService.create(mercadopagoDto);
          // Aquí puedes hacer cualquier otro procesamiento necesario antes de retornar la orden
          // Por ejemplo, podrías guardar el enlace de pago en la orden guardada en la base de datos
          linkMp = paymentLink;
        }
        return { orden:ordenGuardada, link: linkMp };
      }
  
      return { orden:ordenGuardada };
    }
  
  async findAll() {
    const ordenes = await this.ordenModel.find()
    return ordenes
  }

  async findOne(id: string) {
    return await this.ordenModel.findById(id)
  }

  async findLastPending(){
    let lastOrder = await this.ordenModel
    .findOne({ estadoDeCompra: CompraEstado.PENDIENTE })
    .sort({ creacion: -1 })
    .limit(1)
    .exec();
    if(!lastOrder){
      return false
    }
    return lastOrder
  }
  async update(id: string, updateOrdeneDto: UpdateOrdeneDto) {
    let orden:any = await this.ordenModel.findById(id);
    let linkMp: string;
    console.log('updateOrdeneDto', updateOrdeneDto, orden);
  
    if (updateOrdeneDto.productos) {
      for (const producto of updateOrdeneDto.productos) {
        const index = orden.productos.findIndex((p) => p.producto._id.toString() === producto.producto);
        if (index !== -1) {
          // El producto ya existe en la orden, actualiza la cantidad
          orden.productos[index].cantidad += producto.cantidad;
          await this.ordenModel.findByIdAndUpdate(orden.id, orden, { new: true });
        } else {
          // El producto es nuevo, busca el producto en la base de datos y añádelo a la orden
          const productoDB = await this.productsService.findOne(producto.producto);
          if (!productoDB) {
            throw new NotFoundException(`Producto con ID '${producto.producto}' no encontrado.`);
          }
          orden.productos.push({
            producto: productoDB,
            cantidad: producto.cantidad,
          });
        }
        await orden.save()
      }
    }

    if(updateOrdeneDto.nombreCupon){
      const cuponValid = await this.cuponService.applyCupon({nombre:updateOrdeneDto.nombreCupon,userId:orden.usuario.toString()})
      console.log('cuponValid',cuponValid,orden.usuario.toString());
      
      orden.cupon=+cuponValid
      orden.nombreCupon=updateOrdeneDto.nombreCupon
      await orden.save()
    }
    console.log(0,orden)
    if(updateOrdeneDto.estadoDeCompra===CompraEstado.ACEPTADO){
      if(orden.cupon){
        for(const producto of orden.productos){
          if(producto.producto.descuento===0){
            producto.producto.descuento= orden.cupon
            //console.log('producto.producto.precio',producto.producto.preciocondesc);
            await orden.save()
          }
        }
      }
      for (const producto of orden.productos) {
        if (producto.producto.descuento !== 0) {
          producto.producto.preciocondesc= producto.producto.precio-((producto.producto.precio*producto.producto.descuento)/100)
          await orden.save()          
        }
      }
      let total = 0; // Mover la declaración de la variable aquí, fuera del bucle
      let totalsin = 0;
      for (const producto of orden.productos) {
        totalsin += (producto.producto.precio*producto.cantidad);
        total += ((producto.producto.preciocondesc||producto.producto.precio)*producto.cantidad);
      }
      console.log('total',total,totalsin)
      orden.totalConDescuento = total;
      orden.totalSinDescuento = totalsin;
      await orden.save();
      if (orden.tipoDePago === PaymentMethod.MERCADOPAGO) {
        const mercadopagoDto = orden.productos.map((producto) => ({
          producto: producto.producto,
          cantidad: producto.cantidad,
        }));
        const paymentLink = await this.mercadopagoService.create(mercadopagoDto);
        // Aquí puedes hacer cualquier otro procesamiento necesario antes de retornar la orden
        // Por ejemplo, podrías guardar el enlace de pago en la orden guardada en la base de datos
        linkMp = paymentLink;
      }
      orden.estadoDeCompra = updateOrdeneDto.estadoDeCompra
      await orden.save()
      return { orden, link: linkMp };
    }
    await this.ordenModel.findByIdAndUpdate(orden.id,updateOrdeneDto,{new:true})
    return {orden}
  }
  
  async addOrUpdateProductOrStock(addOrUpdateProductDto: AddOrUpdateProductDto) {
    let findOrden: any = await this.ordenModel.findById(addOrUpdateProductDto.orderId);
    console.log('findOrden',findOrden);
    
    for (const producto of addOrUpdateProductDto.productos) {
      let findPro = findOrden.productos.find((f) => f.producto._id.toString() === producto.producto);
      if (findPro) {
        // El producto ya existe en la orden, actualiza la cantidad
        console.log('findPro',findPro);
        findPro.cantidad = producto.cantidad;
        findOrden.productos=[{
          producto: findPro.producto,
          cantidad: findPro.cantidad,
        }]
        await findOrden.save();
      } else {
        // El producto es nuevo, busca el producto en la base de datos y añádelo a la orden
        const productoDB = await this.productsService.findOne(producto.producto);
        if (!productoDB) {
          throw new NotFoundException(`Producto con ID '${producto.producto}' no encontrado.`);
        }
        findOrden.productos.push({
          producto: productoDB,
          cantidad: producto.cantidad,
        });
        await findOrden.save();
      }
    }
    
    await findOrden.save();
  
    return findOrden;
  }

  async remove(id: string) {
    return await this.ordenModel.findByIdAndRemove(id);
  }
}
