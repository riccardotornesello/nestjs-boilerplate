import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../guards/roles.guard';
import { UserRole, UserPermission } from '../constants';
import { User } from '../modules/user/entities/user.entity';
import { PermissionFunctionOptions } from '../guards/roles.guard';

export type AuthOptions = {
  roles?: UserRole[];
  permission?: UserPermission;
  permissionFunction?: (
    user: User,
    options: Partial<PermissionFunctionOptions>,
  ) => boolean;
};

export function Auth({
  roles,
  permission,
  permissionFunction,
}: Partial<AuthOptions>): MethodDecorator {
  return applyDecorators(
    SetMetadata('roles', roles),
    SetMetadata('permission', permission),
    SetMetadata('permissionFunction', permissionFunction),
    UseGuards(AuthGuard('bearer'), RolesGuard),
  );
}
