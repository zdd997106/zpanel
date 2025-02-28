export interface MediaDto {
  id: string;
  name: string;
  size: number;
  mineTypes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AccessibleMediaDto extends MediaDto {
  url: string;
}

export interface UnsyncedMediaDto extends MediaDto {
  file: File;
  url: string;
}
