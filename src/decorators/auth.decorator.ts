// NestJS
import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiSecurity } from '@nestjs/swagger';

// Guards
import { RolesGuard, AuthGuard } from '../guards';
import type { PermissionFunctionOptions } from '../guards';

// Constants
import { UserRole, UserPermission } from '../constants';

// Entities
import { User } from '../modules/user/entities/user.entity';

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
