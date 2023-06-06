import { Controller, Get, BadRequestException } from '@nestjs/common';
import mercadopago from 'mercadopago';

@Controller('pagos')
export class MercadopagoController {
  constructor() {
    mercadopago.configure({
      access_token: 'TEST-2164559296201091-060421-ce3e7dbaf8d3b9e21213e0bd43a34a96-1391296620',
    });
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
