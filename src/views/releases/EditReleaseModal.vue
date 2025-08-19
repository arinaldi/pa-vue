<script setup lang="ts">
import { useForm } from 'vee-validate';

import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import SubmitButton from '@/components/SubmitButton.vue';
import { MESSAGES } from '@/lib/constants';
import { formatDate } from '@/lib/formatters';
import type { Release } from '@/lib/types';
import { useNewReleases } from '@/lib/use-data';
import { useSubmit } from '@/lib/use-submit';
import { supabase } from '@/supabase/client';
import { releaseSchema, type ReleaseInput } from './schema';

const emit = defineEmits<{
  close: [];
}>();
const { release } = defineProps<{
  release: Release;
}>();
const form = useForm({
  initialValues: {
    artist: release.artist,
    title: release.title,
    date: release.date ? formatDate(release.date) : '',
  },
  validationSchema: releaseSchema,
});
const { mutate } = useNewReleases();
const { onSubmit, submitting } = useSubmit({
  callbacks: [
    () => {
      emit('close');
      mutate();
    },
  ],
  handleSubmit: form.handleSubmit,
  submitFn: async ({ date, ...rest }: ReleaseInput) => {
    const { error } = await supabase
      .from('releases')
      .update({
        ...rest,
        date: date.length === 0 ? null : date,
      })
      .eq('id', release.id);

    if (error) {
      throw new Error(error.message);
    }
  },
  successMessage: `${MESSAGES.RELEASE_PREFIX} edited`,
});
</script>

<template>
  <DialogContent>
    <DialogHeader class="text-left">
      <DialogTitle>Edit release</DialogTitle>
      <DialogDescription>Update data for new release</DialogDescription>
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
            <Input type="date" v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <SubmitButton class="w-full sm:w-auto" :submitting="submitting"> Save </SubmitButton>
    </form>
  </DialogContent>
</template>
