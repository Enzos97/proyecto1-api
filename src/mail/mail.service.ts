import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer/dist';
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
        from: `"ECOMMERCE" <${process.env.MAIL_FROM}>`, // override default from
        subject: 'Verification Code',
        text: `Your verification code is: ${code}`,
      });
    } catch (error) {
      this.commonService.handleExceptions(error)
    }
  }

}
