import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import type { UserPermission, UserRole } from '../constants';
import type { User } from '../modules/user/entities/user.entity';

export type PermissionFunctionOptions = {
  roles?: UserRole[];
  permission?: UserPermission;
};

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const permission = this.reflector.get<UserPermission | null>(
      'permission',
      context.getHandler(),
    );
    const roles = this.reflector.get<UserRole[] | null>(
      'roles',
      context.getHandler(),
    );
    const permissionFunction = this.reflector.get<
      (
        user: User,
        options: Partial<PermissionFunctionOptions>,
      ) => boolean | null
    >('permissionFunction', context.getHandler());

    const request = context.switchToHttp().getRequest();
    const user = <User>request.user;

    if (permissionFunction) {
      return permissionFunction(user, { roles, permission });
    } else {
      if (permission && user.hasPermission(permission)) {
        return true;
      }
      if (roles && user.hasRoleIn(roles)) {
        return true;
      }
    }
    return false;
  }
}
