import { MediaDto } from './media.data.dto';
import { RolePreviewDto } from './role.data.dto';

export interface AuthUserDto {
  id: string;
  name: string;
  email: string;
  avatar: MediaDto | null;
  role: RolePreviewDto;
}
