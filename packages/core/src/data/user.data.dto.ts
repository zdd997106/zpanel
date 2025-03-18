import { MediaDto } from './media.data.dto';
import { RolePreviewDto } from './role.data.dto';

export interface UserDto {
  id: string;
  email: string;
  name: string;
  role: RolePreviewDto;
  avatar: null | MediaDto;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserDetailDto {
  id: string;
  email: string;
  name: string;
  bios: string;
  emailNotify: boolean;
  role: RolePreviewDto;
  avatar: null | MediaDto;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreviewDto {
  id: string;
  email: string;
  name: string;
}
