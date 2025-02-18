import { ERole } from 'src/enum';
import { MediaFile } from './media.dataType';

export interface UserPreviewItem {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  avatar: MediaFile | null;
  role: ERole;
  roleName: string;
}

export interface UserDetail {
  id: string;
  name: string;
  email: string;
  bios: string;
  createdAt: Date;
  updatedAt: Date;
  avatar: MediaFile | null;
  role: ERole;
  roleName: string;
}
