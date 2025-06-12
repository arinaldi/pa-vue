<script setup lang="ts">
import { ref } from 'vue';
import { X } from 'lucide-vue-next';

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
import type { AllTimeListItem } from '@/lib/formatters';
import { useAllTimeRankings } from '@/lib/use-data';
import { useSubmit } from '@/lib/use-submit';
import { supabase } from '@/supabase/client';

const emit = defineEmits<{
  remove: [id: number];
}>();
const { item } = defineProps<{
  item: AllTimeListItem;
}>();
const open = ref(false);
const { mutate } = useAllTimeRankings();
const { onSubmit, submitting } = useSubmit({
  callbacks: [
    () => {
      open.value = false;
    },
  ],
  submitFn: async () => {
    const { error } = await supabase
      .from('rankings')
      .update({
        all_time_position: null,
      })
      .eq('id', item.rankingId);

    if (error) {
      throw new Error(error.message);
    }

    emit('remove', item.id);

    await mutate();
  },
  successMessage: 'All-time ranking removed',
});

function setOpen(value: boolean) {
  open.value = value;
}
</script>

<template>
  <Dialog :open="open" @update:open="setOpen">
    <DialogTrigger asChild>
      <Button class="size-6" size="icon" type="button" variant="ghost">
        <X class="size-4" />
      </Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogDescription
          >{{ item.allTimeRanking }}. {{ item.artist }} &ndash; {{ item.title }}</DialogDescription
        >
      </DialogHeader>
      <form @submit.prevent.stop="onSubmit">
        <DialogFooter>
          <SubmitButton :submitting="submitting" variant="destructive">Delete</SubmitButton>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
