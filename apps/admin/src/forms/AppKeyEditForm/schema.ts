import z from '@zpanel/core/schema';
import { CreateAppKeyDto, EAppKeyStatus } from '@zpanel/core';

// ----------

export const schema = CreateAppKeyDto.schema.and(
  z.object({
    expiration: z.number(),
  }),
);

export type FieldValues = z.infer<typeof schema>;

export type FieldKey = keyof FieldValues;

export const initialValues: FieldValues = {
  name: '',
  status: EAppKeyStatus.ENABLED,
  allowPaths: [],
  expiration: 0,
  expiresAt: null,
};
