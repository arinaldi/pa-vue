<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useForm } from 'vee-validate';
import { Eye, EyeOff } from 'lucide-vue-next';

import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useSidebar } from '@/components/ui/sidebar';
import SubmitButton from '@/components/SubmitButton.vue';
import { ROUTES_ADMIN } from '@/lib/constants';
import { useSubmit } from '@/lib/use-submit';
import { supabase } from '@/supabase/client';
import { typedSignInSchema, type SignInInput } from './schema';

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
    password: '',
  },
  validationSchema: typedSignInSchema,
});
const on = ref(false);

const { onSubmit, submitting } = useSubmit({
  callbacks: [() => router.push(ROUTES_ADMIN.base.href)],
  handleSubmit: form.handleSubmit,
  submitFn: async ({ password }: SignInInput) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
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
          <div class="relative">
            <Input
              autofocus
              class="pr-10"
              :type="on ? 'text' : 'password'"
              v-bind="componentField"
            />
            <Button
              aria-label="Show or hide password"
              class="absolute inset-y-0 right-0 mr-0.5 flex cursor-pointer items-center"
              @click="on = !on"
              size="icon"
              type="button"
              variant="ghost"
            >
              <Eye v-if="on" class="size-4" />
              <EyeOff v-else class="size-4" />
            </Button>
          </div>
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
        >Cancel</Button
      >
    </div>
  </form>
</template>
