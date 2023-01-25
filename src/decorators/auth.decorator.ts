import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiSecurity } from '@nestjs/swagger';
import {
  AuthGuard,
  PermissionFunctionOptions,
  RolesGuard,
} from 'src/modules/app/auth/guards';

import { UserPermission, UserRole } from '../constants';
import { User } from '../modules/app/user/entities/user.entity';

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
    ApiSecurity('bearer'),
    SetMetadata('roles', roles),
    SetMetadata('permission', permission),
    SetMetadata('permissionFunction', permissionFunction),
    UseGuards(AuthGuard, RolesGuard),
  );
}
