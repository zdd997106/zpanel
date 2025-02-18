import { ERole } from 'src/enum';

export interface AuthUserDetail {
  id: string;
  avatarUrl: string | null;
  name: string;
  email: string;
  role: ERole;
  roleName: string;
}
