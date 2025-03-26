import { ENotificationType } from 'src/enum';
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

export interface UserNotificationDto {
  id: string;
  title: string;
  message: string;
  link: string | null;
  sender: UserPreviewDto | null;
  read: boolean;
  type: ENotificationType;
  createdAt: Date;
  updatedAt: Date;
}
