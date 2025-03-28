import { ENotificationAudience, ENotificationType } from '@zpanel/core';
import { CreateNotificationsDto } from '@zpanel/core/dto';
import z from '@zpanel/core/schema';

// ----------

export const schema = CreateNotificationsDto.schema.and(z.object({}));

export interface FieldValues extends z.infer<typeof schema> {}

export type FieldKey = keyof FieldValues;

export const initialValues: FieldValues = {
  title: '',
  message: '',
  link: '',
  type: ENotificationType.GENERAL,
  audience: ENotificationAudience.ALL,
  audienceValue: [],
};
