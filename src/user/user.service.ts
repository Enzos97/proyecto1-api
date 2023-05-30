import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
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
@Injectable()
export class UserService {

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
    private readonly mailService:MailService,
  ){}
  async sendCodeAndCreate(sendCodeDto:SendCodeDto){
    console.log(sendCodeDto.email)
    console.log(typeof sendCodeDto.email)
    const code = Math.floor(Math.random() * (999999 - 100000 + 1) + 100000);
    const newUser = await this.userModel.create({email:sendCodeDto.email,code})
    await this.mailService.send_code_mail(sendCodeDto.email,code)
    return newUser
  }

  async create(createUserDto: CreateUserDto) {
    
      try {
  
        let user = await this.userModel.findOne({ email:createUserDto.email });
        if(user.code==createUserDto.code){
          createUserDto.password = hashSync( createUserDto.password, 10 )
          createUserDto.code= null
          let updatedUser = await this.userModel.findByIdAndUpdate(user.id, createUserDto, { new: true });
          return { updatedUser, token: this.setJwtToken({ email: user.email }) };
        }
        throw new BadRequestException('el codigo ingresado es invalido')
        // TODO: Retornar el JWT de acceso
  
      } catch (error) {
        this.handleDBErrors(error);
      }
  }

  async login( loginUserDto: LoginUserDto ) {

    const { password, email } = loginUserDto;
    console.log(email)
    const user = await this.userModel.findOne({ email });
    console.log(user)
    if (!user)
      throw new BadRequestException('The email introduced is incorrect.');
    if (!compareSync(password, user.password))
      throw new BadRequestException('The password introduced is incorrect.');

    return {
      user,
      token: this.setJwtToken({email:user.email})
    };
  }

  async findAll() {
    const users = await this.userModel.find()
    return users
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  private setJwtToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }

  private handleDBErrors( error: any ): never {


    if ( error.code === '23505' ) 
      throw new BadRequestException( error.detail );

    console.log(error)

    throw new InternalServerErrorException('Please check server logs');

  }
}
