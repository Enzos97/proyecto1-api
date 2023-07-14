import { Controller, Get, BadRequestException, Post, Req, Res, forwardRef, Inject } from '@nestjs/common';
import { Request, Response } from 'express';
import mercadopago from 'mercadopago';
import { MercadopagoService } from './mercadopago.service';
import { StatusTypes } from 'src/orden/types/StatusTypes.type';
import { OrdenService } from '../orden/orden.service';

@Controller('pagos')
export class MercadopagoController {
  constructor(
    private mercadopagoService:MercadopagoService,
    @Inject(forwardRef(() => OrdenService))
    private ordenService:OrdenService
  ) {
    // mercadopago.configure({
    //   access_token: 'TEST-2164559296201091-060421-ce3e7dbaf8d3b9e21213e0bd43a34a96-1391296620',
    // });
  }
  @Get('hola')
  hola(){
    return 'hola'
  }
  @Get()
  async realizarPago() {
    const items = [
      {
        title: 'Producto 1',
        quantity: 2,
        currency_id: 'ARS',
        unit_price: 100,
      },
      {
        title: 'Producto 2',
        quantity: 1,
        currency_id: 'ARS',
        unit_price: 560.67,
      },
    ];

    const preference: any = {
      items: items,
    };

    try {
      const response = await mercadopago.preferences.create(preference);
      const paymentLink = response.body.init_point;
      return paymentLink;
    } catch (error) {
      // Manejar el error adecuadamente
      throw new BadRequestException(error.message);
    }
  }
  @Post('webhook')
  async receiveWebhook(@Req() req:Request, @Res() res:Response) {
    try {
      const payment = req.query;
      let ordenId:string;
      let ordenInDb;
      let data;
        data = await this.mercadopagoService.findPaymentById(payment['data.id']);
        ordenId=data.body.metadata.order_id
        if(data.body.status=='approved'){
          console.log('entre en approved REY')
          ordenInDb = await this.ordenService.update(ordenId,{
            status: StatusTypes.ACCEPTED
          })
        }
        console.log('orderidddd',ordenId,data.body.status)
        console.log(data);
        //////////////////////////REDPLOYYYYYYYYYYYYYYYYYYYYYYYY
      return 
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Something went wrong' });
    }
  }
  // @Post()
  // create(@Body() createMercadopagoDto: CreateMercadopagoDto) {
  //   return this.mercadopagoService.create(createMercadopagoDto);
  // }

  // @Get()
  // findAll() {
  //   return this.mercadopagoService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.mercadopagoService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateMercadopagoDto: UpdateMercadopagoDto) {
  //   return this.mercadopagoService.update(+id, updateMercadopagoDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.mercadopagoService.remove(+id);
  // }
}
