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
import type { Release } from '@/lib/types';
import { useNewReleases } from '@/lib/use-data';
import { useSubmit } from '@/lib/use-submit';
import { supabase } from '@/supabase/client';

const emit = defineEmits<{
  close: [];
}>();
const { release } = defineProps<{
  release: Release;
}>();
const { mutate } = useNewReleases();
const { onSubmit, submitting } = useSubmit({
  callbacks: [
    () => {
      emit('close');
      mutate();
    },
  ],
  submitFn: async () => {
    const { error } = await supabase.from('releases').delete().eq('id', release.id);

    if (error) {
      throw new Error(error.message);
    }
  },
  successMessage: `${MESSAGES.RELEASE_PREFIX} deleted`,
});
</script>

<template>
  <DialogContent>
    <DialogHeader class="text-left">
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogDescription>{{ release.artist }} &ndash; {{ release.title }}</DialogDescription>
    </DialogHeader>
    <form @submit.prevent="onSubmit">
      <DialogFooter>
        <SubmitButton :submitting="submitting" variant="destructive">Delete</SubmitButton>
      </DialogFooter>
    </form>
  </DialogContent>
</template>
