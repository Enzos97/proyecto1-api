import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CuponService } from './cupon.service';
import { CreateCuponDto } from './dto/create-cupon.dto';
import { UpdateCuponDto } from './dto/update-cupon.dto';
import { ValidarCuponDto } from './dto/validar-aplicar.dto';

@Controller('cupon')
export class CuponController {
  constructor(private readonly cuponService: CuponService) {}

  @Post()
  create(@Body() createCuponDto: CreateCuponDto) {
    return this.cuponService.create(createCuponDto);
  }
  @Post('validar/descuento')
  validar(@Body() validarCuponDto: ValidarCuponDto) {
    return this.cuponService.applyCupon(validarCuponDto);
  }
  @Post('aplicar/descuento')
  aplicar(@Body() validarCuponDto: ValidarCuponDto) {
    return this.cuponService.restarCupon(validarCuponDto);
  }
  @Get()
  findAll() {
    return this.cuponService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cuponService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCuponDto: UpdateCuponDto) {
    return this.cuponService.update(+id, updateCuponDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cuponService.remove(+id);
  }
}
