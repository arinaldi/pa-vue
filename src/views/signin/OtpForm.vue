<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { useForm } from 'vee-validate';

import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import {
  PinInput,
  PinInputGroup,
  PinInputSeparator,
  PinInputSlot,
} from '@/components/ui/pin-input';
import { useSidebar } from '@/components/ui/sidebar';
import SubmitButton from '@/components/SubmitButton.vue';
import { EMAIL, MESSAGES, ROUTES_ADMIN } from '@/lib/constants';
import { useSubmit } from '@/lib/use-submit';
import { supabase } from '@/supabase/client';
import { typedVerifyOtpSchema, type VerifyOtpInput } from './schema';

const emit = defineEmits<{
  cancel: [email: string];
}>();
const { email } = defineProps<{
  email: string;
}>();
const router = useRouter();
const { isMobile } = useSidebar();
const form = useForm({
  initialValues: {
    code: [],
  },
  validationSchema: typedVerifyOtpSchema,
});

const { onSubmit, submitting } = useSubmit({
  callbacks: [() => router.push(ROUTES_ADMIN.base.href)],
  handleSubmit: form.handleSubmit,
  submitFn: async ({ code }: VerifyOtpInput) => {
    if (email !== EMAIL) {
      throw new Error(MESSAGES.ERROR);
    }

    const { error } = await supabase.auth.verifyOtp({
      email,
      token: code.join(''),
      type: 'email',
    });

    if (error) {
      throw new Error(error.message);
    }
  },
});
</script>

<template>
  <form class="max-w-sm space-y-4" @submit="onSubmit">
    <FormField v-slot="{ componentField, value }" name="code">
      <FormItem>
        <FormLabel>One-time password</FormLabel>
        <FormControl>
          <PinInput
            class="flex items-center gap-2"
            id="code"
            :model-value="value"
            :name="componentField.name"
            otp
            @update:model-value="
              (arrStr) => {
                form.setFieldValue('code', arrStr);
              }
            "
          >
            <PinInputGroup>
              <template v-for="(id, index) in 6" :key="id">
                <PinInputSlot class="border" :index="index" />
                <template v-if="index === 2">
                  <PinInputSeparator class="mx-2" />
                </template>
              </template>
            </PinInputGroup>
          </PinInput>
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <div class="space-y-2">
      <SubmitButton class="w-full" :submitting="submitting">Submit</SubmitButton>
      <Button
        class="w-full"
        @click="emit('cancel', email)"
        :size="isMobile ? 'lg' : 'default'"
        type="button"
        variant="outline"
      >
        Cancel
      </Button>
    </div>
  </form>
</template>
