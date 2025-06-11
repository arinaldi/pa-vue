<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import SubmitButton from '@/components/SubmitButton.vue';
import { MESSAGES, ROUTES_ADMIN } from '@/lib/constants';
import type { Album } from '@/lib/types';
import { useSubmit } from '@/lib/use-submit';
import { supabase } from '@/supabase/client';

const props = defineProps<{
  album: Album;
  class?: string;
}>();
const route = useRoute();
const router = useRouter();
const open = ref(false);
const { onSubmit, submitting } = useSubmit({
  callbacks: [
    () => {
      router.push({
        path: ROUTES_ADMIN.base.href,
        query: route.query,
      });
    },
  ],
  submitFn: async () => {
    if (props.album.favorite) {
      const { data: ranking, error: rankingError } = await supabase
        .from('rankings')
        .select('*')
        .eq('album_id', props.album.id)
        .single();

      if (rankingError) {
        throw new Error(rankingError.message);
      }

      if (ranking) {
        await supabase.from('rankings').delete().eq('id', ranking.id);
      }
    }

    const { error } = await supabase.from('albums').delete().eq('id', props.album.id);

    if (error) {
      throw new Error(error.message);
    }
  },
  successMessage: `${MESSAGES.ALBUM_PREFIX} deleted`,
});

function setOpen(value: boolean) {
  open.value = value;
}
</script>

<template>
  <Dialog :open="open" @update:open="setOpen">
    <DialogTrigger asChild>
      <Button :class="props.class" variant="destructive"> Delete </Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader class="text-left">
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogDescription
          >{{ props.album.artist }} &ndash; {{ props.album.title }}</DialogDescription
        >
      </DialogHeader>
      <form @submit.prevent="onSubmit">
        <DialogFooter>
          <SubmitButton :submitting="submitting" variant="destructive">Delete</SubmitButton>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
