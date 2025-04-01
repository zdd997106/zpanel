/* eslint-disable @typescript-eslint/no-namespace */

export namespace ContractMeForm {
  export interface SubmissionDto {
    id: string;
    name: string;
    email: string;
    service: string;
    createdAt: Date;
  }

  export interface SubmissionDetailDto {
    id: string;
    name: string;
    email: string;
    projectDescription: string;
    budget: string;
    service: string;
    createdAt: Date;
  }
}
