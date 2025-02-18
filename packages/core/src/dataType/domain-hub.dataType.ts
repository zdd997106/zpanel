export interface DomainPreviewItem {
  id: string;
  domain: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DomainDetail {
  id: string;
  domain: string;
  description: string;
  certification: string;
  localPort: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CertificationPreviewItem {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CertificationDetail {
  id: string;
  name: string;
  description: string;
  cert: string;
  key: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PublicFilePreviewItem {
  id: string;
  path: string;
}

export interface PublicFileDetail {
  id: string;
  path: string;
  content: string;
}
