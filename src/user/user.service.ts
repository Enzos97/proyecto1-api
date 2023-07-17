import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { compareSync, hashSync } from 'bcrypt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { LoginUserDto } from './dto/login-user.dto';
import { MailService } from 'src/mail/mail.service';
import { SendCodeDto } from './dto/send-code.dto';
import { NewPasswordUserDto } from './dto/change-password.dto';
import { CommonService } from 'src/common/common.service';
import { loginCode } from './interfaces/login-code.interface';
import { AddNewPurchaseDto } from './dto/addNewPurchase.dto';

@Injectable()
export class UserService {

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
    private readonly mailService:MailService,
    private readonly commonService: CommonService,
  ){}
  async sendCodeAndCreate(sendCodeDto:SendCodeDto){
    try{
      const email = this.decodeBase64(sendCodeDto.email)
      const code = Math.floor(Math.random() * (999999 - 100000 + 1) + 100000);
      const newUser = await this.userModel.create({email:email,code})
      await this.mailService.send_code_mail(email,code)
      return newUser
    }catch(error){
      this.commonService.handleExceptions(error)
    }
  }

  async create(createUserDto: CreateUserDto) {
      try {
        const email = this.decodeBase64(createUserDto.email)
        const password = this.decodeBase64(createUserDto.password)
        let user = await this.userModel.findOne({ email:email });

        if (!user){
          throw new BadRequestException('The email introduced is incorrect.');
        }
        if(user.code==createUserDto.code){
          user.code= null
          user.password= hashSync( password, 10 )
          await user.save()
          return { user, token: this.setJwtToken({ email: email }) };
        }
        throw new BadRequestException('el codigo ingresado es invalido')
  
      } catch (error) {
        this.commonService.handleExceptions(error)
      }
  }

  async login( loginUserDto: LoginUserDto ) {
    const password = this.decodeBase64(loginUserDto.password)
    const email = this.decodeBase64(loginUserDto.email)
    const user = await this.userModel.findOne({ email });

    if (!user){
      throw new BadRequestException('The email introduced is incorrect.');
    }
    if (!compareSync(password, user.password)){
      throw new BadRequestException('The password introduced is incorrect.');
    }
    user.code= null
    await user.save()
    return {
      user,
      token: this.setJwtToken({email:user.email})
    };
  }

  async sendNewCode(email:SendCodeDto){
    try {
      const code = Math.floor(Math.random() * (999999 - 100000 + 1) + 100000);
      const emailDecoded = this.decodeBase64(email.email)
      const updatedUserCode = await this.userModel.findOneAndUpdate(
        { email: emailDecoded },
        { code: code },
        { new: true }
      );
      if (!updatedUserCode){
        throw new BadRequestException('The email introduced is incorrect.');
      }
      console.log(updatedUserCode)
      await this.mailService.send_code_mail(emailDecoded,code)
      return 'codigo enviado.'
    } catch (error) {
      this.commonService.handleExceptions(error);
    }
  }

  async loginWithCode(code:loginCode){
    console.log(code)
    try{
      const user = await this.userModel.findOne({code:code.code})
      if (!user){
        throw new NotFoundException('el codigo ingresado es invalido');
      }
      user.code= null
      await user.save()
      return {
        user,
        token: this.setJwtToken({email:user.email})
      };
    }catch(error){
      this.commonService.handleExceptions(error)
    }
  }

  async changePassword(newPassword:NewPasswordUserDto){
    const user = await this.userModel.findOne({code:newPassword.code})
    const password = this.decodeBase64(newPassword.password)
    if (!user){
      throw new NotFoundException('codigo ingresado incorrecto.')
    }
    user.password = hashSync( password, 10 )
    user.code = null
    await user.save()
    return {
      user,
      token: this.setJwtToken({email:user.email})
    };
  }

  async findAll() {
    try{
      const users = await this.userModel.find()
      return users
    }catch(error){
      this.commonService.handleExceptions(error)
    }
  }

  findOne(id: string) {
    return `This action returns a #${id} user`;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true })
    if (!user){
      throw new NotFoundException('usuario ingresado no encontrado.')
    }
    return user ;
  }

  async addNewPurchase(idUser:string, idPurchase:string){
    return await this.userModel.updateOne(
      { _id: idUser },
      { $push: { misCompras: idPurchase} },
    );
  }

  async addOrden(ordenId:string){
    return this.userModel.findByIdAndUpdate(
      ordenId,
      { $push: { myOrders: ordenId } },
      { new: true },
    );
  }

  async obtenerUltimaOrdenDeCompra(userId: string) {
    const usuario:any = await this.userModel
      .findById(userId)
      .populate({ path: 'misCompras', options: { sort: { creacion: -1 } } });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID '${userId}' no encontrado.`);
    }

    const ultimaOrden = usuario.misCompras[0];
    if (ultimaOrden && ultimaOrden.estadoDeCompra === 'PENDIENTE') {
      return ultimaOrden;
    }
  
    return false;
  }

  async remove(id: string) {
    const user = await this.userModel.findByIdAndDelete(id)
    if (!user){
      throw new NotFoundException('usuario ingresado no encontrado.')
    }
    return `This action removes a #${id} user`;
  }

  private setJwtToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }

  private decodeBase64(encodedText: string): string {
    const decodedText = Buffer.from(encodedText, 'base64').toString('utf-8');
    return decodedText;
  }

}
