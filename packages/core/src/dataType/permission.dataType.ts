import { EPermissionStatus } from 'src/enum';

export interface PermissionItem {
  id: string;
  code: string;
  name: string;
  parentId: string | null;
  status: EPermissionStatus;
  action: number;
}
