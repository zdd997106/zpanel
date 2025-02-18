export interface RolePreviewItem {
  id: string;
  code: string;
  name: string;
  description: string;
  status: number;
  userCount: number;
  permissionCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface RoleDetail {
  id: string;
  code: string;
  name: string;
  description: string;
  status: number;
  createdAt: Date;
  updatedAt: Date;
}
