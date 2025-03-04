import z from '@zpanel/core/schema';
import { ApproveApplicationDto, ERole, RejectApplicationDto } from '@zpanel/core';

// ----------

export const schema = {
  approve: ApproveApplicationDto.schema,
  reject: RejectApplicationDto.schema,
};

export type ApproveFieldValues = z.infer<typeof schema.approve>;

export type RejectFieldValues = z.infer<typeof schema.reject>;

export const initialValues = {
  approve: { role: ERole.GUEST },
  reject: { reason: '' },
};
