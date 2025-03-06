import { ERole } from 'src/enum';
import { AccessibleMediaDto } from './media.data.dto';

export interface UserDto {
  id: string;
  email: string;
  name: string;
  bios: string;
  role: ERole | (string & {});
  roleName: string;
  avatar: null | AccessibleMediaDto;
  createdAt: Date;
  updatedAt: Date;
}
