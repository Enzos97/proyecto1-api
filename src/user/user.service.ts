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

@Injectable()
export class UserService {

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
    private readonly mailService:MailService,
  ){}
  async sendCodeAndCreate(sendCodeDto:SendCodeDto){
    try{
      const email = this.decodeBase64(sendCodeDto.email)
      const code = Math.floor(Math.random() * (999999 - 100000 + 1) + 100000);
      const newUser = await this.userModel.create({email:email,code})
      await this.mailService.send_code_mail(email,code)
      return newUser
    }catch(error){
      this.handleDBErrors(error);
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
        this.handleDBErrors(error);
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
      console.log(updatedUserCode)
      await this.mailService.send_code_mail(emailDecoded,code)
      return 'codigo enviado.'
    } catch (error) {
      this.handleDBErrors(error);
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
    return user
  }
  async findAll() {
    const users = await this.userModel.find()
    return users
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true })
    if (!user){
      throw new NotFoundException('usuario ingresado no encontrado.')
    }
    return user ;
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

  private handleDBErrors( error: any ): never {


    if ( error.code === '23505' ) 
      throw new BadRequestException( error.detail );

    console.log(error)

    throw new InternalServerErrorException('Please check server logs');

  }
}
