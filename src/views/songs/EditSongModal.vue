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
import type { Song } from '@/lib/types';
import { useFeaturedSongs } from '@/lib/use-data';
import { useSubmit } from '@/lib/use-submit';
import { supabase } from '@/supabase/client';
import { typedSongSchema, type SongInput } from './schema';

const emit = defineEmits<{
  close: [];
}>();
const props = defineProps<{
  song: Song;
}>();
const form = useForm({
  initialValues: {
    artist: props.song.artist,
    title: props.song.title,
    link: props.song.link,
  },
  validationSchema: typedSongSchema,
});
const { mutate } = useFeaturedSongs();
const { onSubmit, submitting } = useSubmit({
  callbacks: [
    () => {
      emit('close');
      mutate();
    },
  ],
  handleSubmit: form.handleSubmit,
  submitFn: async (data: SongInput) => {
    const { error } = await supabase.from('songs').update(data).eq('id', props.song.id);

    if (error) {
      throw new Error(error.message);
    }
  },
  successMessage: `${MESSAGES.SONG_PREFIX} edited`,
});
</script>

<template>
  <DialogContent>
    <DialogHeader class="text-left">
      <DialogTitle>Edit song</DialogTitle>
      <DialogDescription>Update data for featured song</DialogDescription>
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
      <SubmitButton class="w-full sm:w-auto" :submitting="submitting"> Save </SubmitButton>
    </form>
  </DialogContent>
</template>
