import { EPermissionAction, EPermissionStatus } from 'src/enum';

type Action = EPermissionAction | (number & {});

export interface PermissionDto {
  id: string;
  code: string;
  name: string;
  parentId: string | null;
  status: EPermissionStatus;
  action: Action;
}
