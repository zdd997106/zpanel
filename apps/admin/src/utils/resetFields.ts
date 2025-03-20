import { UseFormReturn } from 'react-hook-form';

// ----------

export async function resetFields(methods: UseFormReturn<any>) {
  methods.reset();

  await new Promise((resolve) => {
    setTimeout(resolve, 1);
  });

  methods.clearErrors();
}
