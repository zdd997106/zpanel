import { ENotificationAudience, ENotificationStatus, ENotificationType } from 'src/enum';
import { UserPreviewDto } from './user.data.dto';

export interface NotificationDto {
  id: string;
  title: string;
  link: string | null;
  sender: UserPreviewDto | null;
  type: ENotificationType;
  audience: ENotificationAudience;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationDetailDto {
  id: string;
  title: string;
  message: string;
  link: string | null;
  sender: UserPreviewDto | null;
  type: ENotificationType;
  audience: ENotificationAudience;
  recipients: (UserPreviewDto & { status: ENotificationStatus })[];
  createdAt: Date;
  updatedAt: Date;
}
