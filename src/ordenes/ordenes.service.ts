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

@Injectable()
export class OrdenesService {
  constructor(
    @InjectModel(Ordene.name) 
    private readonly ordenModel: Model<Ordene>,
    private readonly productsService: ProductosService,
    private readonly mercadopagoService:MercadopagoService,
    private readonly userService:UserService
  ){

  }
  
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
          size: productoDto.size,
        };
      });
      const productos = await Promise.all(productosPromises);
      
      // Restar el stock de los productos
      for (const producto of productos) {
        const stockTalles = producto.producto.talle;
        const talleSeleccionado = stockTalles.find(talle => talle.talle === producto.size);
        if (!talleSeleccionado || talleSeleccionado.cantidad < producto.cantidad) {
          throw new BadRequestException(`No hay suficiente stock para el producto '${producto.producto.modelo}' en el talle '${producto.size}'.`);
        }
        talleSeleccionado.cantidad -= producto.cantidad;
        //await this.productsService.updateStock(producto.producto._id.toString(), stockTalles);
      }
      // Calcular el total sin descuento
      let totalSinDescuento = 0;
      let totalConDescuento = 0
      for (const producto of productos) {
        totalSinDescuento += producto.producto.precio * producto.cantidad;
        totalConDescuento = totalSinDescuento
        if (producto.producto.descuento !== 0) {
          const subtotalProducto = producto.producto.precio * producto.cantidad;
          const descuentoProducto = (subtotalProducto * producto.producto.descuento) / 100;
          totalConDescuento -= descuentoProducto;
        }
        await producto.producto.save();
      }
  
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
      });
      
      //guardarOrdenEnPerfilDelUsusario
      await this.userService.addNewPurchase(createOrdeneDto.usuario.toString(), nuevaOrden.id)

      // Guardar la orden en la base de datos
      const ordenGuardada = await nuevaOrden.save();
      let linkMp:string;
      // Generar el enlace de pago con Mercado Pago
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

      if(createOrdeneDto.estadoDeCompra===CompraEstado.ACEPTADO){
        return { orden:ordenGuardada, link: linkMp };
      }
  
      return { orden:ordenGuardada };
    }
  
  findAll() {
    return `This action returns all ordenes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ordene`;
  }

  update(id: number, updateOrdeneDto: UpdateOrdeneDto) {
    return `This action updates a #${id} ordene`;
  }

  remove(id: number) {
    return `This action removes a #${id} ordene`;
  }
}
