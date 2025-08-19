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
import { useFeaturedSongs } from '@/lib/use-data';
import { useSubmit } from '@/lib/use-submit';
import { supabase } from '@/supabase/client';
import { songSchema, type SongInput } from './schema';

const initialValues: SongInput = {
  artist: '',
  title: '',
  link: '',
};
const open = ref(false);
const form = useForm({
  initialValues,
  validationSchema: songSchema,
});
const { mutate } = useFeaturedSongs();
const { onSubmit, submitting } = useSubmit({
  callbacks: [
    () => {
      setOpen(false);
      form.resetForm({ values: initialValues });
      mutate();
    },
  ],
  handleSubmit: form.handleSubmit,
  submitFn: async (data: SongInput) => {
    const { error } = await supabase.from('songs').insert(data);

    if (error) {
      throw new Error(error.message);
    }
  },
  successMessage: `${MESSAGES.SONG_PREFIX} added`,
});

function setOpen(value: boolean) {
  open.value = value;
}
</script>

<template>
  <Dialog :open="open" @update:open="setOpen">
    <DialogTrigger asChild>
      <Button>Add song</Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader class="text-left">
        <DialogTitle>Add song</DialogTitle>
        <DialogDescription>What&apos;s the next featured song?</DialogDescription>
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
        <FormField v-slot="{ componentField }" name="link">
          <FormItem>
            <FormLabel>Link</FormLabel>
            <FormControl>
              <Input inputmode="url" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <SubmitButton class="w-full sm:w-auto" :submitting="submitting">Save</SubmitButton>
      </form>
    </DialogContent>
  </Dialog>
</template>
