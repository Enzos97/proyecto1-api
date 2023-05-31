import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer/dist';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
  ) {}

  async send_code_mail(user:string,code:number) {
    console.log(user,code)
      await this.mailerService.sendMail({
        to: user,
        from: `"ECOMMERCE" <${process.env.MAIL_FROM}>`, // override default from
        subject: 'Verification Code',
        text: `Your verification code is: ${code}`,
      });
  }

}
