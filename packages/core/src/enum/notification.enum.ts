export enum ENotificationStatus {
  SEND = 1,
  RECEIVED = 2,
  READ = 3,
  DELETED = 4,
}

export enum ENotificationType {
  SYSTEM = 1,
  SECURITY_ALERT = 2,
  GENERAL = 3,
  TASK = 4,
  ANNOUNCEMENT = 5,
}

export enum ENotificationAudience {
  ALL = 1, // Broadcast to all users
  ADMIN = 2, // Broadcast to all admins
  ROLE = 3, // Broadcast to all users with a specific role
  USER = 4, // Broadcast to specific users
}
