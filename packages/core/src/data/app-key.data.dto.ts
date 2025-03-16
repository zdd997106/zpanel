import { EAppKeyStatus } from 'src/enum';
import { UserPreviewDto } from './user.data.dto';

export interface AppKeyDto {
  id: string;
  name: string;
  key: string;
  status: EAppKeyStatus;
  updatedAt: Date;
  createdAt: Date;
  owner: UserPreviewDto;
  lastModifier: UserPreviewDto | null;
  lastAccessedAt: Date | null;
}

export interface AppKeyDetailDto
  extends Omit<AppKeyDto, 'lastAccessedAt' | 'lastModifier' | 'owner'> {
  origins: string[];
  allowPaths: string[];
  expiresAt: Date | null;
}
