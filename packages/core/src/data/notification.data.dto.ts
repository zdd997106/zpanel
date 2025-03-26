import { ENotificationAudience, ENotificationType } from 'src/enum';
import { UserPreviewDto } from './user.data.dto';

export interface NotificationDto {
  id: string;
  title: string;
  message: string;
  link: string | null;
  sender: UserPreviewDto | null;
  type: ENotificationType;
  audience: ENotificationAudience;
  createdAt: Date;
  updatedAt: Date;
}
