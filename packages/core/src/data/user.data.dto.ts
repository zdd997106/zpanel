import { ERole } from 'src/enum';
import { AccessibleMediaDto } from './media.data.dto';

export interface UserDto {
  email: string;
  name: string;
  bios: string;
  role: ERole;
  avatar: AccessibleMediaDto;
  createdAt: Date;
  updatedAt: Date;
}
