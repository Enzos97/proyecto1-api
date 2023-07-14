import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMercadopagoDto } from './dto/create-mercadopago.dto';
import { UpdateMercadopagoDto } from './dto/update-mercadopago.dto';
import { item } from './interfaces/item.interface';
import mercadopago from 'mercadopago';



@Injectable()
export class MercadopagoService {

  constructor(){
    mercadopago.configure({
      access_token: 'TEST-2164559296201091-060421-ce3e7dbaf8d3b9e21213e0bd43a34a96-1391296620',
    })
  }

  async create(createMercadopagoDto: any) {
    const items = createMercadopagoDto.items.map(({ producto, cantidad }) => {
      const item: item = {
        id:producto.id,
        title: producto.descripcion,
        quantity: cantidad,
        currency_id: "ARS", // Cambia esto si usas una moneda diferente
        unit_price: producto.descuento > 0 ? producto.precio - (producto.precio * producto.descuento) / 100 : producto.precio
      };
    
      return item;
    });
    //console.log('items',items)
    const preference: any = {
      items: items,
      back_urls: {
        success: "https://proyecto1-front.vercel.app/checkout/success",
        // pending: "https://e720-190-237-16-208.sa.ngrok.io/pending",
        failure: "https://proyecto1-front.vercel.app/checkout/failure",
      },
      notification_url: "https://proyecto1-api-pcpucbtdtq-rj.a.run.app/pagos/webhook",
      metadata:{
        orderId:createMercadopagoDto.id,
      }
    };

    try {
      const response = await mercadopago.preferences.create(preference);
      const paymentLink = response.body.init_point;
      return paymentLink;
      //console.log(paymentLink)
    } catch (error) {
      // Manejar el error adecuadamente
      throw new BadRequestException(error.message);
    }
  }
  async findPaymentById(paymentId: any) {
    try {
      console.log(paymentId)
      const data = await mercadopago.payment.findById(paymentId);
      return data;
    } catch (error) {
      throw new Error('Something went wrong');
    }
  }
  findAll() {
    return `This action returns all mercadopago`;
  }

  findOne(id: number) {
    return `This action returns a #${id} mercadopago`;
  }

  update(id: number, updateMercadopagoDto: UpdateMercadopagoDto) {
    return `This action updates a #${id} mercadopago`;
  }

  remove(id: number) {
    return `This action removes a #${id} mercadopago`;
  }
}
