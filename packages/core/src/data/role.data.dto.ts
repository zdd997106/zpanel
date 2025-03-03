import { RolePermissionDto } from 'src/dto';
import { ERole, ERoleStatus } from 'src/enum';

export interface RoleDto {
  id: string;
  name: string;
  code: ERole | (string & {});
  description: string;
  status: ERoleStatus;
  userCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface RoleDetailDto {
  id: string;
  name: string;
  code: ERole | (string & {});
  description: string;
  status: ERoleStatus;
  rolePermissions: RolePermissionDto[];
  createdAt: Date;
  updatedAt: Date;
}
