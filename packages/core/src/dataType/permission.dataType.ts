import { EPermissionAction } from 'src/enum/permission.enum';

export interface PermissionPreviewItem {
  id: string;
  code: string;
  name: string;
  description: string;
  status: number;
  action: EPermissionAction[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PermissionDetail {
  id: string;
  code: string;
  name: string;
  description: string;
  status: number;
  action: EPermissionAction[];
  createdAt: Date;
  updatedAt: Date;
}

export interface RolePermissionRelationItem {
  id: string;
  code: string;
  action: EPermissionAction[];
}
