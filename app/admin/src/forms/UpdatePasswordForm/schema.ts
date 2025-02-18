import { UpdateUserPasswordDto } from '@zpanel/core/dto';
import z from '@zpanel/core/schema';

// ----------

export const schema = UpdateUserPasswordDto.schema
  .and(
    z.object({
      confirmPassword: z.string(),
    }),
  )
  .refinement((args) => args.confirmPassword === args.password, {
    path: ['confirmPassword'],
    code: 'custom',
    message: 'Does not equal to Password',
  });

export interface FieldValues extends z.infer<typeof schema> {}

export type FieldKey = keyof FieldValues;

export const initialValues: FieldValues = {
  password: '',
  confirmPassword: '',
};
