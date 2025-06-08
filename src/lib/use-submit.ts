import { ref, type Ref } from 'vue';
import { useForm } from 'vee-validate';
import { toast } from 'vue-sonner';

import { MESSAGES } from '@/lib/constants';
import type { Callback } from '@/lib/types';
import { capitalizeFirstLetter } from '@/lib/utils';

type HandleSubmit = ReturnType<typeof useForm>['handleSubmit'];

export interface Options {
  callbacks?: Callback[];
  handleSubmit?: HandleSubmit;
  submitFn: (data?: any) => Promise<void>;
  successMessage?: string;
}

interface Payload {
  onSubmit:
    | ((data?: unknown) => Promise<void>)
    | ((e?: Event | undefined) => Promise<Promise<void> | undefined>);
  submitting: Ref<boolean, boolean>;
}

export function useSubmit(options: Options): Payload {
  const submitting = ref(false);
  const { callbacks, handleSubmit, submitFn, successMessage } = options;

  async function handler(data?: unknown) {
    try {
      submitting.value = true;
      await submitFn(data);

      callbacks?.forEach((c) => {
        c();
      });

      if (successMessage) {
        toast.success(successMessage);
      }
    } catch (error: unknown) {
      let message: string = MESSAGES.ERROR;

      if (error instanceof Error && error.message) {
        message = error.message;
      }

      toast.error(capitalizeFirstLetter(message));
    } finally {
      submitting.value = false;
    }
  }

  return {
    onSubmit: handleSubmit ? handleSubmit(handler) : handler,
    submitting,
  };
}
