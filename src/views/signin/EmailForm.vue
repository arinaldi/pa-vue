<script setup lang="ts">
import { useForm } from 'vee-validate';
import { Lock, Send } from 'lucide-vue-next';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import SubmitButton from '@/components/SubmitButton.vue';
import { EMAIL, MESSAGES } from '@/lib/constants';
import { useSubmit } from '@/lib/use-submit';
import { supabase } from '@/supabase/client';
import { typedEmailSchema, type EmailInput, type View } from './schema';

const emit = defineEmits<{
  setView: [view: View, email: string];
}>();
const { email } = defineProps<{
  email: string;
}>();
const form = useForm({
  initialValues: { email },
  validationSchema: typedEmailSchema,
});
const { onSubmit: onEmailSubmit, submitting: emailSubmitting } = useSubmit({
  handleSubmit: form.handleSubmit,
  submitFn: async (data: EmailInput) => {
    if (data.email !== EMAIL) {
      throw new Error(MESSAGES.INVALID_DATA);
    }

    emit('setView', 'password', data.email);
  },
});
const { onSubmit: onOtpSubmit, submitting: otpSubmitting } = useSubmit({
  handleSubmit: form.handleSubmit,
  submitFn: async (data: EmailInput) => {
    if (data.email !== EMAIL) {
      throw new Error(MESSAGES.INVALID_DATA);
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: false },
    });

    if (error) {
      throw new Error(error.message);
    }

    emit('setView', 'otp', data.email);
  },
  successMessage: 'Check your email for the code',
});
</script>

<template>
  <div class="max-w-sm">
    <form class="space-y-4" @submit="onEmailSubmit">
      <FormField v-slot="{ componentField }" name="email">
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input type="email" v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <SubmitButton class="w-full" :submitting="emailSubmitting">
        <Lock class="mr-1 size-4" />
        Sign in with password
      </SubmitButton>
    </form>

    <div class="relative my-6">
      <div class="absolute inset-0 flex items-center">
        <span class="w-full border-t" />
      </div>
      <div class="relative flex justify-center text-xs tracking-wider uppercase">
        <span class="bg-background text-muted-foreground px-2"> or continue with </span>
      </div>
    </div>

    <form @submit="onOtpSubmit">
      <SubmitButton class="w-full" :submitting="otpSubmitting" variant="outline">
        <Send class="mr-1 size-4" />
        Send one-time password
      </SubmitButton>
    </form>
  </div>
</template>
