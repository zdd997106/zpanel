import { RequestToUpdateUserEmailDto } from '@zpanel/core/dto';
import z from '@zpanel/core/schema';

// ----------

export const schema = RequestToUpdateUserEmailDto.schema.and(z.object({}));

export interface FieldValues extends z.infer<typeof schema> {}

export type FieldKey = keyof FieldValues;

export const initialValues: FieldValues = {
  email: '',
};
