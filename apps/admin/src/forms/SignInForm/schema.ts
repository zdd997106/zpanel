import { SignInDto } from '@zpanel/core/dto';
import z from '@zpanel/core/schema';

// ----------

export const schema = SignInDto.schema.and(z.object({}));

export interface FieldValues extends z.infer<typeof schema> {}

export type FieldKey = keyof FieldValues;

export const initialValues: FieldValues = {
  account: '',
  password: '',
};
