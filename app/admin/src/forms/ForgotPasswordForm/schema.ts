import { RequestToResetPasswordDto } from '@zpanel/core/dto';
import z from '@zpanel/core/schema';

// ----------

export const schema = RequestToResetPasswordDto.schema.and(z.object({}));

export interface FieldValues extends z.infer<typeof schema> {}

export type FieldKey = keyof FieldValues;

export const initialValues: FieldValues = {
  email: '',
};
