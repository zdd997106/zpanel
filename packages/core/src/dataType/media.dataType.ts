interface MediaFileBase {
  id: string;
  url: string;
  name: string;
  size: number;
  mineTypes: string;
}

export interface MediaFile extends MediaFileBase {
  createdAt: Date;
  updatedAt: Date;
}

export interface NoUrlMediaFile extends Omit<MediaFile, 'url'> {}

export interface UnhandledMediaFile extends MediaFileBase {
  file: File;
}
