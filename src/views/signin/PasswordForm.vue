<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useForm } from 'vee-validate';
import { useMediaQuery } from '@vueuse/core';

import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import SubmitButton from '@/components/SubmitButton.vue';
import { MOBILE_MEDIA_QUERY, ROUTES_ADMIN } from '@/lib/constants';
import { useSubmit } from '@/lib/use-submit';
import { supabase } from '@/supabase/client';
import { typedSignInSchema, type SignInInput } from './schema';

const emit = defineEmits<{
  cancel: [email: string];
}>();
const props = defineProps<{
  email: string;
}>();
const router = useRouter();
const mobile = useMediaQuery(MOBILE_MEDIA_QUERY);
const form = useForm({
  initialValues: {
    password: '',
  },
  validationSchema: typedSignInSchema,
});

function onCancel() {
  emit('cancel', props.email);
}

const { onSubmit, submitting } = useSubmit({
  callbacks: [() => router.push(ROUTES_ADMIN.base.href)],
  handleSubmit: form.handleSubmit,
  submitFn: async ({ password }: SignInInput) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: props.email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }
  },
});
</script>

<template>
  <form class="max-w-sm space-y-4" @submit="onSubmit">
    <FormField v-slot="{ componentField }" name="password">
      <FormItem>
        <FormLabel>Password</FormLabel>
        <FormControl>
          <Input type="password" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <div class="space-y-2">
      <SubmitButton class="w-full" :submitting="submitting">Submit</SubmitButton>
      <Button
        class="w-full"
        @click="onCancel"
        :size="mobile ? 'lg' : 'default'"
        type="button"
        variant="outline"
        >Cancel</Button
      >
    </div>
  </form>
</template>
