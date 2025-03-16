import { ERole } from 'src/enum';
import { MediaDto } from './media.data.dto';

export interface UserDto {
  id: string;
  email: string;
  name: string;
  bios: string;
  role: ERole | (string & {});
  roleName: string;
  avatar: null | MediaDto;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreviewDto {
  id: string;
  email: string;
  name: string;
}
