import { UseFormReturn } from 'react-hook-form';

// ----------

/**
 * Resets the form fields and clears errors.
 *
 * The reset method in react-hook-form does not immediately clear errors,
 * so we create this function to smoothly reset the form and prevent errors displaying just after reset
 */

export async function resetFields(methods: UseFormReturn<any>) {
  methods.reset();

  await new Promise((resolve) => {
    setTimeout(resolve, 1);
  });

  methods.clearErrors();
}
