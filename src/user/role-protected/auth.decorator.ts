import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RoleProtected } from './role-protected.decorator';
import { Role } from 'src/user/types/role.type';
import { UserRoleGuard } from '../guards/user-role.guard';

export function Auth(...role: Role[]) {
  return applyDecorators(
    RoleProtected(...role),
    UseGuards(AuthGuard('jwt'), UserRoleGuard),
  );
}
