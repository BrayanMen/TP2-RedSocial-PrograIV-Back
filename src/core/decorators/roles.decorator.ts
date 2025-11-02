import { SetMetadata } from '@nestjs/common';
import { ROLES_KEY, UserRole } from '../constants/roles.constant';

export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
