import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { SendCodeDto } from './dto/send-code.dto';
import { Auth } from './role-protected/auth.decorator';
import { Role } from './types/role.type';
import { NewPasswordUserDto } from './dto/change-password.dto';
import { loginCode } from './interfaces/login-code.interface';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  sendCodeAndCreate(@Body() sendCodeDto:SendCodeDto) {
    return this.userService.sendCodeAndCreate(sendCodeDto);
  }

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.userService.login(loginUserDto);
  }

  @Post('loginWithCode')
  loginWithCode(@Body() code: loginCode) {
    return this.userService.loginWithCode(code)
  }


  @Post('newCode')
  sendCode(@Body() sendCode:SendCodeDto){
    return this.userService.sendNewCode(sendCode)
  }

  @Patch('changePassword')
  updatePassword(@Body() newPasswordUserDto:NewPasswordUserDto) {
    return this.userService.changePassword(newPasswordUserDto);
  }

  // @Auth()
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  // @Auth(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
