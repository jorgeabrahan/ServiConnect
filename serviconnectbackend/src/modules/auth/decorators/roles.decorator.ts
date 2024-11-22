import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: ('superadmin' | 'admin' | 'user')[]) =>
  SetMetadata(ROLES_KEY, roles);
