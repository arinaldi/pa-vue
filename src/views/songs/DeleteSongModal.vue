<script setup lang="ts">
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import SubmitButton from '@/components/SubmitButton.vue';
import { MESSAGES } from '@/lib/constants';
import type { Song } from '@/lib/types';
import { useFeaturedSongs } from '@/lib/use-data';
import { useSubmit } from '@/lib/use-submit';
import { supabase } from '@/supabase/client';

const emit = defineEmits<{
  close: [];
}>();
const props = defineProps<{
  song: Song;
}>();
const { mutate } = useFeaturedSongs();
const { onSubmit, submitting } = useSubmit({
  callbacks: [
    () => {
      emit('close');
      mutate();
    },
  ],
  submitFn: async () => {
    const { error } = await supabase.from('songs').delete().eq('id', props.song.id);

    if (error) {
      throw new Error(error.message);
    }
  },
  successMessage: `${MESSAGES.SONG_PREFIX} deleted`,
});
</script>

<template>
  <DialogContent>
    <DialogHeader class="text-left">
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogDescription>{{ props.song.artist }} &ndash; {{ props.song.title }}</DialogDescription>
    </DialogHeader>
    <form @submit.prevent="onSubmit">
      <DialogFooter>
        <SubmitButton :submitting="submitting" variant="destructive">Delete</SubmitButton>
      </DialogFooter>
    </form>
  </DialogContent>
</template>
