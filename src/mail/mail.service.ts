import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

import { CommonService } from 'src/common/common.service';
@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private commonService:CommonService
  ) {}

  async send_code_mail(user:string,code:number) {
    try {
      await this.mailerService.sendMail({
        to: user,
        from: `"REYES DEL OESTE" <${process.env.MAIL_FROM}>`, // override default from
        subject: 'Verification Code',
        text: `Your verification code is: ${code}`,
      });
    } catch (error) {
      this.commonService.handleExceptions(error)
    }
  }
  async send_code_mail_for_order(user: string, id:string, code: number, orderData:any,  fullName:string) {
    try {
      console.log('mail dto',user,id,code,fullName)
      const verificationLink = `https://vagimports.vercel.app/token`;
  
      await this.mailerService.sendMail({
        to: user,
        from: `"REYES DEL OESTE" <${process.env.MAIL_FROM}>`, // override default from
        subject: 'Codigo de verificacion y link para cargar comprobante',
        html: `<p>Tu codigo de verificacion es: ${code}</p>
               <p>Click <a href="${verificationLink}">aqui</a> para verificar su cuenta y cargar su comprobante.</p>
               <h1>Detalles del Pedido</h1>
               <h2>Cliente</h2>
               <p>Nombre : ${fullName}</p>
               <p>Email: ${user}</p>
               <h2>Productos</h2>
               <ul>
                 ${orderData.products
                   .map(
                     (product) => `
                     <li>
                       <p>Producto: ${product.producto.descripcion}</p>
                       <p>Cantidad: ${product.cantidad}</p>
                       <p>Precio unitario: ${product.producto.precio}</p>
                       <p>Precio con descuento: ${product.producto.preciocondesc}</p>
                     </li>
                   `
                   )
                   .join('')}
               </ul>
               
               <h2>Resumen del Pedido</h2>
               <p>Total sin descuento: ${orderData.totalWithOutDiscount}</p>
               <p>Total con descuento: ${orderData.totalWithDiscount}</p>
               <p>Tipo de pago: ${orderData.payType}</p>
               <p>Envío: ${orderData.shiping ? 'Sí' : 'No'}</p>
               <p>Estado: ${orderData.status}</p>
               <p>Número de cliente: ${orderData.tokenClient}</p>
               <p>Factura A: ${orderData.isFacturaA ? 'Sí' : 'No'}</p>`,
      });
    } catch (error) {
      this.commonService.handleExceptions(error);
    }
  }
  async send_code_mail_Transferencia(user: string, id:string, code: number) {
    try {
      console.log('mail dto',user,id,code)
      const verificationLink = `https://vagimports.vercel.app/token`;
  
      await this.mailerService.sendMail({
        to: user,
        from: `"REYES DEL OESTE" <${process.env.MAIL_FROM}>`, // override default from
        subject: 'Codigo de verificacion y link para cargar comprobante',
        html: `<p>Tu codigo de verificacion es: ${code}</p>
        <p>Click <a href="${verificationLink}">aqui</a> para verificar su cuenta y cargar su comprobante.</p>
        <div style="background-color: #f2f2f2;">
          <div style="padding-top: 20px;padding-bottom: 20px">
            <h2 class="section-header__title" style="color: black;margin-top: 10px;margin-bottom: 15px;font-variant:all-petite-caps; font-size: x-large;font-weight: 500"><a style="font-size: small;">Titular de la cuenta:</a> Juan Manuel Garcia</h2>
            <h2 class="section-header__title" style="color: black;margin-bottom: 15px;font-variant:all-petite-caps; font-size: x-large;font-weight: 500"><a style="font-size: small;">Alias:</a> vagimports
              <a><img src="https://storage.googleapis.com/vagimport-images/banco-galicia-logo%20(1).webp" style="margin-left: 5px;width: 24px"></a>
            </h2>
            <h2 class="section-header__title" style="color: black;margin-bottom: 15px;font-variant:all-petite-caps; font-size: x-large;font-weight: 500"><a style="font-size: small;">CBU:</a> 0070400120000000444626
              <a><img src="https://storage.googleapis.com/vagimport-images/banco-galicia-logo%20(1).webp" style="margin-left: 5px;width: 24px"></a>
            </h2>
            <h2 class="section-header__title" style="color: black;margin-bottom: 15px;font-variant:all-petite-caps; font-size: x-large;font-weight: 500"><a style="font-size: small;">CUIT:</a> 20-40392828-4 </h2>
            <h2 class="section-header__title" style="color: black;font-variant:all-petite-caps; font-size: x-large;font-weight: 500"><a style="font-size: small;">Banco:</a> Galicia</h2>
          </div>
        </div>`
      });
    } catch (error) {
      this.commonService.handleExceptions(error);
    }
  }

  async send_code_mail_Deposito(user: string, id:string, code: number) {
    try {
      console.log('mail dto',user,id,code)
      const verificationLink = `https://vagimports.vercel.app/token`;
  
      await this.mailerService.sendMail({
        to: user,
        from: `"REYES DEL OESTE" <${process.env.MAIL_FROM}>`, // override default from
        subject: 'Codigo de verificacion y link para cargar comprobante',
        html: `<p>Tu codigo de verificacion es: ${code}</p>
        <p>Click <a href="${verificationLink}">aqui</a> para verificar su cuenta y cargar su comprobante.</p>
        <div style="background-color: #f2f2f2;margin-top: -15px">
          <h2 class="section-header__title" style="color: black;margin-bottom: 15px;font-variant:all-petite-caps; font-size: x-large;font-weight: 500"><a style="font-size: small;">Titular de la cuenta:</a> Juan Manuel Garcia</h2>
          <h2 class="section-header__title" style="color: black;margin-bottom: 15px;font-variant:all-petite-caps; font-size: x-large;font-weight: 500"><a style="font-size: small;">N° de cuenta:</a> 0000444-6 400-2
            <a><img src="https://storage.googleapis.com/vagimport-images/banco-galicia-logo%20(1).webp" style="margin-left: 5px;width: 24px"></a>
          </h2>
          <h2 class="section-header__title" style="color: black;margin-bottom: 15px;font-variant:all-petite-caps; font-size: x-large;font-weight: 500"><a style="font-size: small;">CBU:</a> 0070400120000000444626
            <a><img src="https://storage.googleapis.com/vagimport-images/banco-galicia-logo%20(1).webp" style="margin-left: 5px;width: 24px"></a>
          </h2>
          <h2 class="section-header__title" style="color: black;margin-bottom: 15px;font-variant:all-petite-caps; font-size: x-large;font-weight: 500"><a style="font-size: small;">CUIT:</a> 20-40392828-4</h2>
          <h2 class="section-header__title" style="color: black;margin-bottom: 15px;font-variant:all-petite-caps; font-size: x-large;font-weight: 500"><a style="font-size: small;">Banco:</a> Galicia</h2>
          <hr>
        </div>`
      });
    } catch (error) {
      this.commonService.handleExceptions(error);
    }
  }
}
