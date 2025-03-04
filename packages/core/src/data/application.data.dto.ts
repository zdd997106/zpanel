import { EApplicationStatus } from 'src/enum/application.enum';

export interface ApplicationDto {
  id: string;
  email: string;
  name: string;
  introduction: string;
  status: EApplicationStatus;
  reviewer: null | {
    id: string;
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
