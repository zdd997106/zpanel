// ----- PERMISSION CODE -----

export enum EPermission {}

// ----- PERMISSION ACTION -----

export enum EPermissionAction {
  CREATE = 1 << 0,
  READ = 1 << 1,
  UPDATE = 1 << 2,
  DELETE = 1 << 3,
}

// ----- PERMISSION STATUS -----

export enum EPermissionStatus {
  ENABLED = 1,
  DISABLED = 2,
}

export enum EPermissionCategory {
  DASHBOARD = 1,
  CATALOG = 2,
  CONFIGURATION = 3,
  TOOL = 4,
  SYSTEM = 5,
  OTHER = 6,
}
