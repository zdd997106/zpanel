import { MediaDto } from './media.data.dto';
import { RolePreviewDto } from './role.data.dto';

export interface AuthUserDto {
  id: string;
  account: string;
  name: string;
  email: string | null;
  avatar: MediaDto | null;
  role: RolePreviewDto;
}
