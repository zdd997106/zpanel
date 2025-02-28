import { EPermissionStatus } from '@zpanel/core';
import { PermissionItem } from '@zpanel/core/dataType';

export const mockSource: PermissionItem[] = [
  {
    id: '1',
    parentId: null,
    code: 'PARENT_1',
    name: 'Parent 1',
    status: EPermissionStatus.ENABLED,
  },
  {
    id: '2',
    code: 'CHILD_1_1',
    name: 'Child 1-1',
    parentId: '1',
    status: EPermissionStatus.ENABLED,
  },
  {
    id: '3',
    code: 'CHILD_1_2',
    name: 'Child 1-2',
    parentId: '1',
    status: EPermissionStatus.ENABLED,
  },
  {
    id: '4',
    parentId: null,
    code: 'PARENT_2',
    name: 'Parent 2',
    status: EPermissionStatus.ENABLED,
  },
  {
    id: '5',
    code: 'CHILD_2_1',
    name: 'Child 2-1',
    parentId: '4',
    status: EPermissionStatus.DISABLED,
  },
  {
    id: '6',
    code: 'CHILD_2_2',
    name: 'Child 2-2',
    parentId: '4',
    status: EPermissionStatus.ENABLED,
  },
  {
    id: '7',
    parentId: null,
    code: 'PARENT_3',
    name: 'Parent 3',
    status: EPermissionStatus.ENABLED,
  },
  {
    id: '8',
    code: 'CHILD_3_1',
    name: 'Child 3-1',
    parentId: '7',
    status: EPermissionStatus.ENABLED,
  },
  {
    id: '9',
    code: 'CHILD_3_2',
    name: 'Child 3-2',
    parentId: '7',
    status: EPermissionStatus.ENABLED,
  },
  {
    id: '10',
    code: 'CHILD_3_3',
    name: 'Child 3-3',
    parentId: '7',
    status: EPermissionStatus.ENABLED,
  },
];
