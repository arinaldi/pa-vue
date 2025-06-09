<script setup lang="ts">
import { ref } from 'vue';
import { useForm } from 'vee-validate';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import SubmitButton from '@/components/SubmitButton.vue';
import { MESSAGES } from '@/lib/constants';
import { useNewReleases } from '@/lib/use-data';
import { useSubmit } from '@/lib/use-submit';
import { supabase } from '@/supabase/client';
import { typedReleaseSchema, type ReleaseInput } from './schema';

const initialValues: ReleaseInput = {
  artist: '',
  title: '',
  date: '',
};
const open = ref(false);
const form = useForm({
  initialValues,
  validationSchema: typedReleaseSchema,
});
const { mutate } = useNewReleases();
const { onSubmit, submitting } = useSubmit({
  callbacks: [
    () => {
      setOpen(false);
      form.resetForm({ values: initialValues });
      mutate();
    },
  ],
  handleSubmit: form.handleSubmit,
  submitFn: async ({ date, ...rest }: ReleaseInput) => {
    const { error } = await supabase.from('releases').insert({
      ...rest,
      date: date.length === 0 ? null : date,
    });

    if (error) {
      throw new Error(error.message);
    }
  },
  successMessage: `${MESSAGES.RELEASE_PREFIX} added`,
});

function setOpen(value: boolean) {
  open.value = value;
}
</script>

<template>
  <Dialog :open="open" @update:open="setOpen">
    <DialogTrigger asChild>
      <Button>Add release</Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader class="text-left">
        <DialogTitle>Add release</DialogTitle>
        <DialogDescription>What&apos;s the newest release?</DialogDescription>
      </DialogHeader>
      <form class="space-y-4" @submit="onSubmit">
        <FormField v-slot="{ componentField }" name="artist">
          <FormItem>
            <FormLabel>Artist</FormLabel>
            <FormControl>
              <Input autofocus v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="title">
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="date">
          <FormItem>
            <FormLabel>Date</FormLabel>
            <FormControl>
              <Input class="w-full" type="date" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <SubmitButton class="w-full sm:w-auto" :submitting="submitting"> Save </SubmitButton>
      </form>
    </DialogContent>
  </Dialog>
</template>
